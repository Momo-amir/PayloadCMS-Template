import type { GlobalConfig } from 'payload'
import { revalidateLoginConfig } from './hooks/revalidateLoginConfig'
import { linkGroup } from '@/cms/fields/linkGroup'

const localizedText = (
  name: string,
  defaultValue: string,
  en: string,
  da: string,
  width = '50%',
) => ({
  name,
  type: 'text' as const,
  localized: true,
  defaultValue,
  label: { en, da },
  admin: { width },
})

// Non-commerce login/auth UI config. Editable labels + toggles so any project can drive its login,
// create-account and forgot-password flows from the admin. Read via getCachedGlobal('login-config').
export const LoginConfig: GlobalConfig = {
  slug: 'login-config',
  access: { read: () => true },
  label: { en: 'Login & Account', da: 'Login & Konto' },
  admin: {
    group: { en: 'Settings', da: 'Indstillinger' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Login', da: 'Login' },
          fields: [
            localizedText('title', 'Log in', 'Title', 'Titel', '100%'),
            {
              name: 'intro',
              type: 'textarea',
              localized: true,
              label: { en: 'Intro text', da: 'Introtekst' },
            },
            {
              type: 'row',
              fields: [
                localizedText('submitLabel', 'Continue', 'Submit button', 'Send-knap'),
                localizedText('logoutLabel', 'Log out', 'Log out button', 'Log ud-knap'),
              ],
            },
            {
              type: 'row',
              fields: [
                localizedText(
                  'createAccountLabel',
                  'Create an account',
                  'Create-account link',
                  'Opret konto-link',
                ),
                localizedText(
                  'forgotPasswordLabel',
                  'Forgot your password?',
                  'Forgot-password link',
                  'Glemt adgangskode-link',
                ),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'showCreateAccount',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show "Create account"', da: 'Vis "Opret konto"' },
                  admin: { width: '50%' },
                },
                {
                  name: 'showForgotPassword',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show "Forgot password"', da: 'Vis "Glemt adgangskode"' },
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Create account', da: 'Opret konto' },
          fields: [
            localizedText('createTitle', 'Create an account', 'Title', 'Titel', '100%'),
            {
              name: 'createIntro',
              type: 'textarea',
              localized: true,
              label: { en: 'Intro text', da: 'Introtekst' },
            },
            localizedText(
              'createSubmitLabel',
              'Create Account',
              'Submit button',
              'Send-knap',
              '100%',
            ),
          ],
        },
        {
          label: { en: 'Forgot password', da: 'Glemt adgangskode' },
          fields: [
            localizedText('forgotTitle', 'Forgot Password', 'Title', 'Titel', '100%'),
            {
              name: 'forgotIntro',
              type: 'textarea',
              localized: true,
              defaultValue:
                'Please enter your email below. You will receive an email with instructions on how to reset your password.',
              label: { en: 'Intro text', da: 'Introtekst' },
            },
            localizedText(
              'forgotSubmitLabel',
              'Reset Password',
              'Submit button',
              'Send-knap',
              '100%',
            ),
            localizedText(
              'forgotSuccessTitle',
              'Request submitted',
              'Success title',
              'Succes-titel',
              '100%',
            ),
            {
              name: 'forgotSuccessMessage',
              type: 'textarea',
              localized: true,
              defaultValue:
                'Check your email for a link that will allow you to securely reset your password.',
              label: { en: 'Success message', da: 'Succes-besked' },
            },
          ],
        },
        {
          label: { en: 'Account', da: 'Konto' },
          description: {
            en: 'Texts for the Account Details block (overview + profile editing).',
            da: 'Tekster til Account Details-blokken (overblik + profilredigering).',
          },
          fields: [
            localizedText('accountTitle', 'Your account', 'Title', 'Titel', '100%'),
            {
              name: 'accountIntro',
              type: 'textarea',
              localized: true,
              label: { en: 'Intro text', da: 'Introtekst' },
            },
            {
              type: 'row',
              fields: [
                localizedText(
                  'profileSectionLabel',
                  'Profile',
                  'Profile section',
                  'Profil-sektion',
                ),
                localizedText(
                  'profileSubmitLabel',
                  'Save changes',
                  'Profile submit button',
                  'Profil gem-knap',
                ),
              ],
            },
            localizedText(
              'profileSuccessMessage',
              'Profile updated.',
              'Profile success message',
              'Profil succes-besked',
              '100%',
            ),
            {
              type: 'row',
              fields: [
                localizedText(
                  'passwordSectionLabel',
                  'Change password',
                  'Password section',
                  'Adgangskode-sektion',
                ),
                localizedText(
                  'passwordSubmitLabel',
                  'Update password',
                  'Password submit button',
                  'Adgangskode gem-knap',
                ),
              ],
            },
            {
              type: 'row',
              fields: [
                localizedText(
                  'currentPasswordLabel',
                  'Current password',
                  'Current-password field',
                  'Nuværende adgangskode-felt',
                ),
                localizedText(
                  'newPasswordLabel',
                  'New password',
                  'New-password field',
                  'Ny adgangskode-felt',
                ),
              ],
            },
            localizedText(
              'passwordSuccessMessage',
              'Password updated.',
              'Password success message',
              'Adgangskode succes-besked',
              '100%',
            ),
            {
              type: 'row',
              fields: [
                localizedText(
                  'loggedOutMessage',
                  'You need to sign in to view your account.',
                  'Logged-out message',
                  'Ikke-logget-ind besked',
                ),
                localizedText('signInLabel', 'Sign in', 'Sign-in button', 'Log ind-knap'),
              ],
            },
          ],
        },
        {
          label: { en: 'Field labels', da: 'Feltnavne' },
          description: {
            en: 'Labels for the form input fields, shared across the auth forms.',
            da: 'Navne til formularfelterne, delt på tværs af login-formularerne.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                localizedText('nameLabel', 'Name', 'Name field', 'Navn-felt'),
                localizedText('emailLabel', 'Email', 'Email field', 'Email-felt'),
              ],
            },
            {
              type: 'row',
              fields: [
                localizedText('passwordLabel', 'Password', 'Password field', 'Adgangskode-felt'),
                localizedText(
                  'passwordConfirmLabel',
                  'Confirm password',
                  'Confirm-password field',
                  'Bekræft adgangskode-felt',
                ),
              ],
            },
          ],
        },
        {
          label: { en: 'Consent', da: 'Samtykke' },
          fields: [
            {
              name: 'requireConsent',
              type: 'checkbox',
              defaultValue: false,
              label: {
                en: 'Require a privacy/terms checkbox',
                da: 'Kræv en privatlivs-/vilkårs-afkrydsning',
              },
            },
            {
              ...localizedText(
                'consentLabel',
                'I agree to the',
                'Consent label',
                'Samtykke-tekst',
                '100%',
              ),
              admin: { condition: (_, siblingData) => Boolean(siblingData?.requireConsent) },
            },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => Boolean(siblingData?.requireConsent) },
              fields: [
                localizedText('consentLinkLabel', 'privacy policy', 'Link label', 'Link-tekst'),
                {
                  name: 'consentLink',
                  type: 'text',
                  defaultValue: '/privacy-policy',
                  label: { en: 'Link URL', da: 'Link-URL' },
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Extra links', da: 'Ekstra links' },
          fields: [
            linkGroup({
              appearances: ['default', 'outline', 'link'],
              overrides: {
                name: 'extraLinks',
                label: { en: 'Extra links', da: 'Ekstra links' },
                admin: {
                  description: {
                    en: 'Optional links shown below the login form (e.g. help, terms).',
                    da: 'Valgfri links under login-formularen (fx hjælp, vilkår).',
                  },
                },
              },
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateLoginConfig],
  },
}
