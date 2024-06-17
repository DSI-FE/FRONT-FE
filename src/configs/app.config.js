const appConfig =
{
    apiPrefix:                  'http://127.0.0.1:8000/api',
    locale:                     'es',
    logoSrc:                    'http://127.0.0.1:8000/api/images/general/logo.png',
    escudoSrc:                  'http://127.0.0.1:8000/api/images/general/escudo.png',
    authenticatedEntryPath:     '/directory/employees',
    unAuthenticatedEntryPath:   '/signin',
    changePasswordEntryPath:    '/change-password',
    tourPath:                   '/',
    enableMock:                 false
};

export default appConfig;
