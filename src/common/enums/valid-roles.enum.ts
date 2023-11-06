import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
	root = 'root',
	super = 'super',
	admin = 'admin',
	user = 'user',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
