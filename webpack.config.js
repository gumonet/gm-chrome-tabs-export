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
https://www.youtube.com/watch?v=N6ZR4M1z6Yc