import oneOrMore, { OneOrMore } from './oneOrMore';

// Wraps input in an array (if it is not one already) and gets the first element
const one = <T>(items: OneOrMore<T>): T => oneOrMore(items)[0];

export default one;
