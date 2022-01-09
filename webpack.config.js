module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/i, //Que archivos vas a utilizar?
                exclude: /node_modules/, //Archivos a excluir
                use: {
                    loader: "babel-loader",
                }
            },
        ]
    }
}
