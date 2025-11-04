import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EnCivar - Türkiye\'nin Yerel Rehberi',
  description: 'Civarındaki en iyi işletmeleri keşfedin. Restoranlar, hizmetler, mağazalar ve daha fazlası.',
  keywords: 'yerel rehber, işletme, restoran, hizmet, Türkiye',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>

        {/* GTM head script */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P58XRGWF');
          `}
        </Script>





        {/* -------------------------- */}
        {/* Google Analytics */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17670181553"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17670181553');
            
            // Conversion tracking function
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-17670181553/I111CPzAy7EbELGl5ulB',
                  'value': 1.0,
                  'currency': 'TRY',
                  'event_callback': callback
              });
              return false;
            }
          `}
        </Script> */}

        {/* ClickCease.com Tracking */}
        {/* <Script id="clickcease" strategy="afterInteractive">
          {`
            var script = document.createElement('script');
            script.async = true;
            script.type = 'text/javascript';
            script.src = 'https://www.clickcease.com/monitor/stat.js';
            document.head.appendChild(script);
          `}
        </Script>
        <noscript>
          <a href="https://www.clickcease.com" rel="nofollow">
            <img src="https://monitor.clickcease.com" alt="ClickCease" />
          </a>
        </noscript> */}
        {/* End ClickCease.com Tracking */}

        {/* AdGuardy Tracking Script */}
        {/* <Script id="agp-config" strategy="afterInteractive">
          {`
            window.AGP_TRACKING_ID = 't39ibMcq_5DlR9Rx';
            window.AGP_API_URL = 'https://adguardy.com';
            console.log('adguardy config loaded:', window.AGP_TRACKING_ID);
            
            // Tracker yükleme kontrolü
            var script = document.createElement('script');
            script.src = 'https://adguardy.com/js/tracker.js';
            script.async = true;
            script.onload = function() {
              console.log('adguardy tracker.js loaded successfully');
            };
            script.onerror = function() {
              console.error('adguardy tracker.js failed to load');
            };
            document.head.appendChild(script);
          `}
        </Script> */}
        {/* End adguardy */}

      </head>
      <body className={inter.className}>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P58XRGWF"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {children}
      </body>
    </html>
  )
}
