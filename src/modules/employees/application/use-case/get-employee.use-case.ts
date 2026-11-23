import { EmployeeOutput, toEmployeeOutput } from '../dto/employee.dto';
import { EmployeeNotFoundError } from '../../domain/errors/employee.error';
import { canReadSensitive } from '../../domain/sensitive-fields';
import { ActorContext } from '../../domain/types';
import { IEmployeeRepository } from '../port/employee.repository.port';

export class GetEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string, actor: ActorContext): Promise<EmployeeOutput> {
    const includeSensitive = canReadSensitive(actor.permissions);
    const view = await this.employeeRepository.findViewById(id, {
      includeSensitive,
    });
    if (!view) throw new EmployeeNotFoundError(id);
    return toEmployeeOutput(view, includeSensitive);
  }
}
