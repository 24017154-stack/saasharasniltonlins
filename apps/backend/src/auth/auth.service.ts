import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR';
  name: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.databaseService.queryOne<User & { password_hash: string }>(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()],
    );

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async findUserById(id: string): Promise<User | null> {
    return this.databaseService.queryOne<User>(
      'SELECT id, email, role, name, created_at, updated_at FROM users WHERE id = $1',
      [id],
    );
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}