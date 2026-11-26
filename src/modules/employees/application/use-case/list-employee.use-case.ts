import { canReadSensitive } from '../../domain/sensitive-fields';
import type { ActorContext, EmployeeFilters, Page } from '../../domain/types';
import { EmployeeOutput, toEmployeeOutput } from '../dto/employee.dto';
import type { IEmployeeRepository } from '../port/employee.repository.port';

export class ListEmployeesUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(
    filters: EmployeeFilters,
    actor: ActorContext,
  ): Promise<Page<EmployeeOutput>> {
    const includeSensitive = canReadSensitive(actor.permissions);
    const page = await this.employeeRepository.list(filters, {
      includeSensitive,
    });
    return {
      ...page,
      items: page.items.map((view) => toEmployeeOutput(view, includeSensitive)),
    };
  }
}
