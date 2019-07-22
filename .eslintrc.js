module.exports = {
	"extends": [
		"eslint:recommended",
		'plugin:vue/recommended',
	],
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module"
	},
	"rules": {
		"brace-style": ["error", "1tbs", { "allowSingleLine": true }],
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		"semi": ["error", "always"],
		"no-console": ["error", { "allow": ["warn", "log"] }],
		"vue/html-indent": ["error", "tab", {
			"attribute": 1,
			"baseIndent": 1,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": []
		}],
		"vue/max-attributes-per-line": ["error", {
			"singleline": 3,
			"multiline": {
				"max": 1,
				"allowFirstLine": false
			}
		}],
		"vue/html-self-closing": ["error", {
			"html": {
				"void": "always",
				"normal": "any",
				"component": "always"
			}
		}],
		"vue/no-v-html": "off"
	},
	"globals": {
		"Vue": false,
		"__dirname": false,
		"window": false,
		"document": false,
		"setTimeout": false,
		"clearTimeout": false,
		"setInterval": false,
		"clearInterval": false,
		"Promise": false,
		"module": false,
		"console": false,
		"require": false,
		"STable": false,
		"HTMLElement": false
	}
}