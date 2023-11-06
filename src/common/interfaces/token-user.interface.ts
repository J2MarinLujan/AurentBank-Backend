import { Request } from 'express';
import { ValidRoles } from '../enums/valid-roles.enum';

export interface TokenUserInterface extends Request {
	id: string;
	role: ValidRoles;
}
