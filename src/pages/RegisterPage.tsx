import RegisterForm from '../features/authentication/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    }}>
      <RegisterForm />
    </div>
  );
}
