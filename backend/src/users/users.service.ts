import { Injectable , NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

   async create(createUserDto: CreateUserDto) {
  const existingUser = await this.userRepository.findOneBy({
    email: createUserDto.email,
  });

  if (existingUser) {
    throw new ConflictException('Email already exists');
  }

  const user = this.userRepository.create(createUserDto);

  return this.userRepository.save(user);
}

  async findAll() {
    return this.userRepository.find();
  }

   async findOne(id: number) {
  const user = await this.userRepository.findOneBy({ id });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}

    async findByEmail(email: string) {
  return this.userRepository.findOneBy({ email });
}

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOneBy({ id });
  }

   async remove(id: number) {
  const result = await this.userRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException('User not found');
  }

  return {
    message: 'User deleted successfully',
  };
}
}