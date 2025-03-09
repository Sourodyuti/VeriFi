import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Add preload script to prevent theme flickering */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var savedTheme = localStorage.getItem('theme');
                    var prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
                    
                    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
                      document.documentElement.classList.add('dark-theme');
                    } else {
                      document.documentElement.classList.remove('dark-theme');
                    }
                  } catch (e) {
                    console.error('Error applying theme:', e);
                  }
                })();
              `,
            }}
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var savedTheme = localStorage.getItem('theme');
                    var prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
                    
                    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
                      document.body.classList.add('dark-theme');
                    } else {
                      document.body.classList.remove('dark-theme');
                    }
                  } catch (e) {
                    console.error('Error applying theme to body:', e);
                  }
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 