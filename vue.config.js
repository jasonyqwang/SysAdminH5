const fs = require('fs')
module.exports = {
    productionSourceMap: false,
    css: {
        loaderOptions: {
            sass: {
                data: fs.readFileSync('src/assets/css/variable.scss', 'utf-8')
            }
        }
    }
}