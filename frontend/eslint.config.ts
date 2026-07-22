import { globalIgnores } from 'eslint/config'

import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'

const applicationFiles = ['**/*.{vue,ts,mts,tsx}']

const ignoredFiles = ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/scripts/**']

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: applicationFiles,
    },

    globalIgnores(ignoredFiles),

    ...pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,

    ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

    {
        name: 'app/custom-eslint-rules',
        files: applicationFiles,
        rules: {
            'max-nested-callbacks': ['error', 5],
            'max-lines': ['error', 1000],
        },
    },

    skipFormatting,
)
