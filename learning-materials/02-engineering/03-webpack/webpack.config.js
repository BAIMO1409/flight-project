// ============================================
// Webpack 配置示例
// 涵盖核心知识点：Entry、Output、Loader、Plugin、开发服务器
// ============================================

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * Webpack配置说明：
 * 
 * 1. mode: 模式（development/production）
 * 2. entry: 入口文件
 * 3. output: 输出配置
 * 4. module: Loader配置
 * 5. plugins: 插件配置
 * 6. devServer: 开发服务器配置
 */

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    console.log('=== Webpack配置 ===');
    console.log('模式:', isProduction ? 'production' : 'development');

    return {
        // ============================================
        // 1. 模式配置
        // ============================================
        mode: isProduction ? 'production' : 'development',
        
        // ============================================
        // 2. 入口配置
        // ============================================
        entry: {
            main: './src/index.js'
        },
        
        // ============================================
        // 3. 输出配置
        // ============================================
        output: {
            filename: isProduction 
                ? '[name].[contenthash].js'  // 生产环境：带hash缓存
                : '[name].js',               // 开发环境：不带hash
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        
        // ============================================
        // 4. Loader配置（处理非JavaScript文件）
        // ============================================
        module: {
            rules: [
                // 4.1 TypeScript处理
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                
                // 4.2 JavaScript处理（Babel）
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                
                // 4.3 CSS处理
                {
                    test: /\.css$/,
                    use: [
                        isProduction 
                            ? MiniCssExtractPlugin.loader  // 生产环境：提取CSS文件
                            : 'style-loader',              // 开发环境：注入到DOM
                        'css-loader'                       // 解析CSS
                    ]
                },
                
                // 4.4 SCSS/SASS处理
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isProduction 
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader',
                        'css-loader',
                        'sass-loader'                      // 编译SCSS为CSS
                    ]
                },
                
                // 4.5 图片处理
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[hash][ext][query]'
                    }
                },
                
                // 4.6 字体处理
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[hash][ext][query]'
                    }
                }
            ]
        },
        
        // ============================================
        // 5. 插件配置（扩展Webpack功能）
        // ============================================
        plugins: [
            // 5.1 清理构建目录
            new CleanWebpackPlugin(),
            
            // 5.2 生成HTML文件
            new HtmlWebpackPlugin({
                template: './index.html',
                title: 'Webpack示例',
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true
                } : false
            }),
            
            // 5.3 提取CSS到单独文件（生产环境）
            isProduction && new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css'
            })
        ].filter(Boolean),
        
        // ============================================
        // 6. 开发服务器配置
        // ============================================
        devServer: {
            static: {
                directory: path.join(__dirname, 'public')
            },
            compress: true,
            port: 3001,
            hot: true,           // 热更新
            open: true,          // 自动打开浏览器
            historyApiFallback: true,  // 路由回退
            proxy: {
                '/api': {
                    target: 'http://localhost:3003',
                    changeOrigin: true
                }
            }
        },
        
        // ============================================
        // 7. 解析配置
        // ============================================
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        
        // ============================================
        // 8. Source Map配置
        // ============================================
        devtool: isProduction 
            ? 'source-map'      // 生产环境：生成独立source map
            : 'inline-source-map' // 开发环境：内联source map
    };
};
