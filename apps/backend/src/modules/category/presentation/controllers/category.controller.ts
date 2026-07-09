import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryRoutes } from '../routes/category.routes';
import { CategorySwagger } from '../swagger/category.swagger';
import { CreateCategoryUseCase } from '../../application/use_cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use_cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use_cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../application/use_cases/get-category.use-case';
import { CreateCategoryDto } from '../../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../../application/dto/update-category.dto';
import { CreateCategoryCommand } from '../../application/commands/create-category.command';
import { UpdateCategoryCommand } from '../../application/commands/update-category.command';
import { DeleteCategoryCommand } from '../../application/commands/delete-category.command';
import { GetCategoryQuery } from '../../application/queries/get-category.query';

/**
 * REST controller for Category. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Category')
@Controller(CategoryRoutes.base)
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
  ) {}

  @Post()
  @ApiOperation(CategorySwagger.create)
  @ApiResponse({ status: 201, description: 'Category created.' })
  create(@Body() dto: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(
      new CreateCategoryCommand(
        dto.name,
        dto.description,
        dto.icon,
        dto.color,
        dto.type,
      ),
    );
  }

  @Put(CategoryRoutes.byId)
  @ApiOperation(CategorySwagger.update)
  @ApiResponse({ status: 200, description: 'Category updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.updateCategoryUseCase.execute(
      new UpdateCategoryCommand(id, dto.name, dto.description, dto.status),
    );
  }

  @Delete(CategoryRoutes.byId)
  @ApiOperation(CategorySwagger.delete)
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteCategoryUseCase.execute(new DeleteCategoryCommand(id));
  }

  @Get(CategoryRoutes.byId)
  @ApiOperation(CategorySwagger.get)
  @ApiResponse({ status: 200, description: 'Category found.' })
  findOne(@Param('id') id: string) {
    return this.getCategoryUseCase.execute(new GetCategoryQuery(id));
  }
}
