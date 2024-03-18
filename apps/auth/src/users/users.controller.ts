import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserserviceController,
  CreateUserDto,
  UpdateUserDto,
  UserserviceControllerMethods,
  FindOneUserDto,
  PaginationDto,
} from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@UserserviceControllerMethods()
export class UsersController implements UserserviceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAll();
  }

  findOneUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.remove(findOneUserDto.id);
  }

  queryUsers(PaginationDtoStream: Observable<PaginationDto>) {
    return this.usersService.queryUsers(PaginationDtoStream);
  }
}
