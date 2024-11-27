# Auth module
For handling HTTP Auth.

## Strategies

Currently only JWT is supported

## Configuration

| variable         | description                                                                                                                                                                        | required |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| JWT_AUDIENCE     | The audience expected in the validated JWT                                                                                                                                         | yes      |
| JWT_ISSUER       | The issuer expected in the validated JWT                                                                                                                                           | yes      |
| JWT_ALGORITHM    | The algorithm expected for the JWT. hs256 or rs256                                                                                                                                 | yes      |
| JWT_JWKS_ENABLED | Whether to use JWKS to gather the key for use in verifying the JWT. true, false, 0, or 1 are accepted. Defaults to true                                                            | no       |
| JWT_SECRET       | A static secret to use for verifying the JWT. Not recommended for production environments. Required if JWT_JWKS_ENABLED is false. Forbidden if JWT_JWKS_ENABLED is true or not set | no       |

## Usage

Add the Auth Module to your root module.

Use the `@Public` decorator for REST routes that should be accessible without authentication

Use the `@PBAC` decorator to define the access checks for a REST route

## Local testing

If you need to test a running server, you can configure JWT_SECRET to your own value. This will allow you to generate a JWT of your own without connecting to auth0. Use jwt.io for help generating a JWT, it will need:
 
 - an iss field matching the JWT_ISSUER configuration
 - an aud field containing a match for the JWT_AUDIENCE configuration (aud should be an array of strings, one of them should match this value)
 - an alg header matching the JWT_ALGORITHM configuration (and to have been signed using this algorithm)
 - an iat (or issued at) timestamp in the past
 - an exp (or expiration) timestamp in the future
 - a sub (or subscriber) field that looks like `auth0|{USER_ID}`, eg `auth0|62a02730407271eeb4f86463`

## PBAC

Decorate controllers or controller methods with `@PBAC(accessCheckFn)` to add pbac checks to them

`accessCheckFn` is a function that receives the express Request object, and returns an AccessCheckDto or an array of AccessCheckDTO's.

All routes have a default feature check applied to them: `feature:EnableConsoleMicroservices`, whether PBAC is defined or not

`@PBAC` can be used on routes also decorated with `@Public`, and will use the roles marked with `unauthenticatedSystemDefault: true` for checks with unauthenticated users

## Principal

Decorate controller parameters with `@Principal()` to receive the authenticated user's Principal (as a PrincipalDto)

Not available on Routes decorated with `@NoPBAC`

Unauthenticated users still have a Principal - but the user is null.

## NoPBAC

Decorate controllers or controller methods with `@NoPBAC()` to prevent any access checks (including the default feature flag check).

The `@Principal` param decorator is not available in this case. 