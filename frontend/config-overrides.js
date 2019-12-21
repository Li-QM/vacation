const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin'); //gzip
const BrotliPlugin = require('brotli-webpack-plugin'); //brotli
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, env) => {
  config.plugins.push(
		new CompressionPlugin({ //gzip plugin
			filename: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.(js|css|html|svg)$/,
			threshold: 8192,
			minRatio: 0.8
		}),
		new BrotliPlugin({ //brotli plugin
			asset: '[path].br[query]',
			test: /\.(js|css|html|svg)$/,
			threshold: 10240,
			minRatio: 0.8
		}),
		// new BundleAnalyzerPlugin()
	)
  return config
}