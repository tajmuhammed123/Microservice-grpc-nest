import {
  CreateUserDto,
  User,
  UpdateUserDto,
  Users,
  PaginationDto,
} from '@app/common';
import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i <= 100; i++) {
      this.create({ username: randomUUID(), password: randomUUID(), age: 0 });
    }
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      subscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): Users {
    return { users: this.users };
  }

  findOne(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex != -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };
      return this.users[userIndex];
    }
    throw new NotFoundException(`User not found by id ${id}`);
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex != -1) {
      return this.users.splice(userIndex)[0];
    }
    throw new NotFoundException(`User not found by id ${id}`);
  }

  queryUsers(
    PaginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    const subject = new Subject<Users>();

    const onNext = (PaginationDto: PaginationDto) => {
      const start = PaginationDto.page * PaginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + PaginationDto.skip),
      });
    };
    const onComplete = () => subject.complete();
    PaginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    });
    return subject.asObservable();
  }
}
