module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {},
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      primary: 'var(--ant-primary-color)',
      'primary-hover': 'var(--ant-primary-color-hover)',
      'primary-active': 'var(--ant-primary-color-active)',
      'primary-outline': 'var(--ant-primary-color-outline)',
      'primary-bg': 'var(--ant-primary-1)',

      info: 'var(--ant-info-color)',
      'info-bg': 'var(--ant-info-color-deprecated-bg)',

      success: 'var(--ant-success-color)',
      'success-hover': 'var(--ant-success-color-hover)',
      'success-active': 'var(--ant-success-color-active)',
      'success-outline': 'var(--ant-success-color-outline)',
      'success-bg': 'var(--ant-success-color-deprecated-bg)',

      warning: 'var(--ant-warning-color)',
      'warning-hover': 'var(--ant-warning-color-hover)',
      'warning-active': 'var(--ant-warning-color-active)',
      'warning-outline': 'var(--ant-warning-color-outline)',
      'warning-bg': 'var(--ant-warning-color-deprecated-bg)',

      error: 'var(--ant-error-color)',
      'error-hover': 'var(--ant-error-color-hover)',
      'error-active': 'var(--ant-error-color-active)',
      'error-outline': 'var(--ant-error-color-outline)',
      'error-bg': 'var(--ant-error-color-deprecated-bg)',

      // body 的背景色
      'body-bg': '#EAEDF1',

      // light 之后会使用css变量，在dark模式下替换为深灰色
      light: '#fff',
      // white 和 black 为固定值，不会随dark模式变动
      white: '#fff',
      black: '#000',
      transparent: 'transparent',

      // 中性色
      gray: {
        title: 'rgba(0,0,0,.85)',
        text1: 'rgba(0,0,0,.85)',
        text2: 'rgba(0,0,0,.45)',
        disable: 'rgba(0,0,0,.25)',
        border: 'rgba(0,0,0,.15)',
        divider: 'rgba(0,0,0,.06)',
        bg: 'rgba(0,0,0,.04)',
        'table-header': 'rgba(0,0,0,.02)',
      },
      'gray-opacity': {
        title: '#262626',
        text1: '#262626',
        text2: '#8c8c8c',
        disable: '#bfbfbf',
        border: '#d9d9d9',
        divider: '#f0f0f0',
        bg: '#f5f5f5',
        'table-header': '#fafafa',
      },
    },
    spacing: {
      0: '0',
      8: '8px', // small
      16: '16px', // middle
      24: '24px', // large
      40: '40px',
      64: '64px',

      '-8': '-8px', // small
      '-16': '-16px', // middle
      '-24': '-24px', // large
      '-40': '-40px',
      '-64': '-64px',
    },
    minHeight: {
      0: '0',
      8: '8px', // small
      16: '16px', // middle
      24: '24px', // large
      40: '40px',
      64: '64px',
    },
    fontSize: {
      12: ['12px', '20px'],
      14: ['14px', '22px'],
      16: ['16px', '24px'],
      20: ['20px', '28px'],
      24: ['24px', '32px'],
      30: ['30px', '38px'],
      38: ['38px', '46px'],
      46: ['46px', '54px'],
      56: ['56px', '64px'],
    },
    screens: {},
    extend: {
      boxShadow: {
        1: '0px 1px 2px -2px rgba(0, 0, 0, 0.16), 0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09)',
        2: '0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px	16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)',
        3: '0px 6px 16px -8px rgba(0, 0, 0, 0.08), 0px 9px 28px	0px rgba(0, 0, 0, 0.05), 0px 12px 48px 16px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  variants: {
    extend: {
      transform: ['hover'],
    },
  },
  plugins: [],
}
