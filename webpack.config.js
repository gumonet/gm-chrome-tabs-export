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
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'css/main.css',
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                type: "asset",
                test: /\.(png|svg|jpg|jpeg|gif)$/i
            }
        ]
    }
}