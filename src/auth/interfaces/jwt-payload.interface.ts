import { ValidRoles } from '../../common/enums/valid-roles.enum';

export interface JwtPayloadInterface {
	id: number;
	role: ValidRoles;
	iat: number;
	exp: number;
}
