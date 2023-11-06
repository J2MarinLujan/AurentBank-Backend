import { GraphQLScalarType, Kind } from 'graphql';

export const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar types',
	serialize(date: Date) {
		if (date instanceof Date) {
			return date.toISOString();
		} else if (typeof date === 'string') {
			return date;
		}
		throw Error(
			'GraphQL Date Scalar serializer expected a `Date` object or a valid date string'
		);
	},
	parseValue(date: string) {
		if (typeof date === 'string') {
			return new Date(date); // Convert incoming integer to Date
		}
		throw new Error('GraphQL Date Scalar parser expected a `string`');
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value);
		}
		return null;
	},
});
