import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase().trim();

    const existingUser = await this.userRepository.findOneBy({
      email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const adminEmail = this.configService
      .get<string>('ADMIN_EMAIL')
      ?.toLowerCase()
      .trim();

    const role = email === adminEmail ? 'admin' : 'user';

    const user = this.userRepository.create({
      ...registerDto,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;

    return result;
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase().trim();

    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const adminEmail = this.configService
      .get<string>('ADMIN_EMAIL')
      ?.toLowerCase()
      .trim();

    if (email === adminEmail && user.role !== 'admin') {
      user.role = 'admin';
      await this.userRepository.save(user);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { password, ...result } = user;

    return {
      access_token: accessToken,
      user: result,
    };
  }

  async googleLogin(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const email = googleUser.email.toLowerCase().trim();

    const adminEmail = this.configService
      .get<string>('ADMIN_EMAIL')
      ?.toLowerCase()
      .trim();

    let user = await this.userRepository.findOneBy({
      email,
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      user = this.userRepository.create({
        email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        password: '',
        school: undefined,
        department: undefined,
        level: undefined,
        role: email === adminEmail ? 'admin' : 'user',
      });

      user = await this.userRepository.save(user);
    } else if (email === adminEmail && user.role !== 'admin') {
      user.role = 'admin';

      user = await this.userRepository.save(user);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { password, ...result } = user;

    return {
      access_token: accessToken,
      user: result,
      isNewUser,
    };
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;

    return result;
  }
}