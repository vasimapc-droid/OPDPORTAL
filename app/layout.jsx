import './globals.css';

export const metadata = {
  title: 'Doctor OPD Portal',
  description: 'Hospital OPD Appointment Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
