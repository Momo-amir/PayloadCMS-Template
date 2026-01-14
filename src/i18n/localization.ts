const localization = {
  locales: [
    {
      code: 'da',
      label: 'Danish',
    },
    {
      code: 'en',
      label: 'English',
      fallbackLocale: 'da', // Fallback to Danish when English content is missing
    },
  ],
  defaultLocale: 'da',
  fallback: true,
  defaultLocalePublishOption: 'all',
}

export default localization
