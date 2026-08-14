import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { RolesGuard } from '../../../../common/auth/roles.guard';
import { Roles } from '../../../../common/auth/roles.decorator';
import { Role } from '../../../../common/auth/role.enum';
import { CategoryRoutes } from '../routes/category.routes';
import { CategorySwagger } from '../swagger/category.swagger';
import { CreateCategoryUseCase } from '../../application/use_cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use_cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use_cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../application/use_cases/get-category.use-case';
import { ListCategoryUseCase } from '../../application/use_cases/list-category.use-case';
import { SearchCategoryUseCase } from '../../application/use_cases/search-category.use-case';
import { ListCategorySpecializationsUseCase } from '../../application/use_cases/list-category-specializations.use-case';
import { DeleteCategoryCommand } from '../../application/commands/delete-category.command';
import { GetCategoryQuery } from '../../application/queries/get-category.query';
import { ListCategoryQuery } from '../../application/queries/list-category.query';
import { SearchCategoryQuery } from '../../application/queries/search-category.query';
import { ListCategorySpecializationsQuery } from '../../application/queries/list-category-specializations.query';
import { CreateCategoryRequestDto } from '../dto/create-category.request.dto';
import { UpdateCategoryRequestDto } from '../dto/update-category.request.dto';
import { CategoryResponseDto } from '../dto/category.response.dto';
import { CategoryListResponseDto } from '../dto/category-list.response.dto';
import { CategorySpecializationResponseDto } from '../dto/category-specialization.response.dto';
import { CategoryHttpMapper } from '../dto/category-http.mapper';

/**
 * REST controller for Category. Only exposes routes, maps HTTP DTOs
 * to Application commands/queries via `CategoryHttpMapper`, and
 * delegates to the corresponding Use Case — no business logic lives
 * here. Domain exceptions thrown by Use Cases (`NotFoundException`,
 * `ValidationException`) are translated to HTTP responses by the
 * global `DomainExceptionFilter` (`common/filters/`), registered in
 * `main.ts` — this controller never catches them itself. `Category`
 * is a standalone catalog entity — no cross-module dependency, no
 * relation to verify.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /categories/search` resolves to `search()` rather than
 * being matched as `findOne({ id: 'search' })`.
 *
 * Authorization (Sprint 4, Etapa 18): Categories are marketplace-wide
 * catalog data, so the write routes (`create`/`update`/`remove`) are
 * `@Roles(Role.Admin)`. Until an administrative account exists, they
 * are effectively closed — which is the intended state: no mobile
 * client calls them (the app only ever issues `GET /categories`), and
 * previously any authenticated user could rename or delete a category
 * the whole marketplace depends on. The read routes stay open to any
 * authenticated caller, since browsing the catalog is what every
 * Customer does.
 */
@ApiTags('Category')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller(CategoryRoutes.base)
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly listCategoryUseCase: ListCategoryUseCase,
    private readonly searchCategoryUseCase: SearchCategoryUseCase,
    private readonly listCategorySpecializationsUseCase: ListCategorySpecializationsUseCase,
  ) {}

  @Post()
  @ApiOperation(CategorySwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Category created.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @Roles(Role.Admin)
  async create(
    @Body() dto: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.createCategoryUseCase.execute(
      CategoryHttpMapper.toCreateCommand(dto),
    );
    return CategoryHttpMapper.toResponse(category);
  }

  @Put(CategoryRoutes.byId)
  @ApiOperation(CategorySwagger.update)
  @ApiParam({ name: 'id', description: 'Category id' })
  @ApiResponse({
    status: 200,
    description: 'Category updated.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    type: ErrorResponseDto,
  })
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.updateCategoryUseCase.execute(
      CategoryHttpMapper.toUpdateCommand(id, dto),
    );
    return CategoryHttpMapper.toResponse(category);
  }

  @Delete(CategoryRoutes.byId)
  @ApiOperation(CategorySwagger.delete)
  @ApiParam({ name: 'id', description: 'Category id' })
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    type: ErrorResponseDto,
  })
  @Roles(Role.Admin)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCategoryUseCase.execute(new DeleteCategoryCommand(id));
  }

  @Get()
  @ApiOperation(CategorySwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Categories.',
    type: CategoryListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<CategoryListResponseDto> {
    const query = new ListCategoryQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listCategoryUseCase.execute(query);
    return CategoryHttpMapper.toListResponse(result);
  }

  @Get(CategoryRoutes.search)
  @ApiOperation(CategorySwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'Plumbing' })
  @ApiResponse({
    status: 200,
    description: 'Categories matching the search term.',
    type: [CategoryResponseDto],
  })
  async search(@Query('term') term: string): Promise<CategoryResponseDto[]> {
    const categories = await this.searchCategoryUseCase.execute(
      new SearchCategoryQuery(term),
    );
    return categories.map((category) =>
      CategoryHttpMapper.toResponse(category),
    );
  }

  @Get(CategoryRoutes.specializationsByCategory)
  @ApiOperation(CategorySwagger.specializations)
  @ApiParam({ name: 'categoryId', description: 'Category id' })
  @ApiResponse({
    status: 200,
    description: "The Category's Specializations.",
    type: [CategorySpecializationResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    type: ErrorResponseDto,
  })
  async specializations(
    @Param('categoryId') categoryId: string,
  ): Promise<CategorySpecializationResponseDto[]> {
    const specializations = await this.listCategorySpecializationsUseCase.execute(
      new ListCategorySpecializationsQuery(categoryId),
    );
    return specializations.map((specialization) =>
      CategoryHttpMapper.toSpecializationResponse(specialization),
    );
  }

  @Get(CategoryRoutes.byId)
  @ApiOperation(CategorySwagger.get)
  @ApiParam({ name: 'id', description: 'Category id' })
  @ApiResponse({
    status: 200,
    description: 'Category found.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.getCategoryUseCase.execute(
      new GetCategoryQuery(id),
    );
    return CategoryHttpMapper.toResponse(category);
  }
}
