
const PassportServiceProvider = require('..').default
const Haluka = require('@haluka/core').Application
const UserModel = require('../User').default

test('create passport instance', async () => {

    new PassportServiceProvider(Haluka.getInstance()).register()
    use('Haluka/Provider/Passport/Local', { UserModel })
})

