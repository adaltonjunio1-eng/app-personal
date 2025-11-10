import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SectionTitle } from '../../components/common/SectionTitle';
import { User, Mail, Lock, LogOut, Camera, Phone, MapPin, Calendar, Activity, Target, Award } from 'lucide-react';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    address: (user as any)?.address || '',
    birthDate: (user as any)?.birthDate || '',
    bio: (user as any)?.bio || '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo || null);

  const handleSave = () => {
    // Aqui implementaria a atualização do perfil
    alert('Perfil atualizado com sucesso!');
    setIsEditing(false);
    // Atualiza foto do usuário localmente (mock)
    if (user && photoPreview) {
      setUser({ ...user, photo: photoPreview });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: (user as any)?.phone || '',
      address: (user as any)?.address || '',
      birthDate: (user as any)?.birthDate || '',
      bio: (user as any)?.bio || '',
    });
    setIsEditing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      <SectionTitle 
        title="Meu Perfil" 
        subtitle="Gerencie suas informações pessoais"
      />

      <Card accent="neutral">
        <div className="profile-header">
          <div className="profile-avatar">
            {photoPreview ? (
              <img src={photoPreview} alt={user?.name} />
            ) : (
              <User size={48} />
            )}
            <label className="avatar-upload">
              <Camera size={18} />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
          </div>
          
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p className="profile-type">
              {user?.type === 'personal' ? 'Personal Trainer' : 'Aluno'}
            </p>
          </div>
        </div>
      </Card>

      <Card accent="neutral">
        <div className="profile-form">
          <h3>Informações Pessoais</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <User size={18} />
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} />
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                placeholder="seu@email.com"
              />
            </div>

            <div className="form-group">
              <label>
                <Phone size={18} />
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={18} />
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <MapPin size={18} />
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div className="form-group">
            <label>
              <Activity size={18} />
              Sobre Você
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Conte um pouco sobre seus objetivos e rotina..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            {!isEditing ? (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Salvar Alterações
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {user?.type === 'aluno' && (
        <Card accent="primary">
          <div className="profile-stats">
            <h3>
              <Target size={20} />
              Estatísticas
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Activity />
                </div>
                <div className="stat-content">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Treinos Concluídos</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Award />
                </div>
                <div className="stat-content">
                  <span className="stat-value">85%</span>
                  <span className="stat-label">Taxa de Conclusão</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Target />
                </div>
                <div className="stat-content">
                  <span className="stat-value">-3kg</span>
                  <span className="stat-label">Progresso</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Calendar />
                </div>
                <div className="stat-content">
                  <span className="stat-value">45</span>
                  <span className="stat-label">Dias Ativos</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card accent="neutral">
        <div className="profile-security">
          <h3>Segurança</h3>
          <Button variant="ghost" icon={<Lock size={18} />}>
            Alterar Senha
          </Button>
        </div>
      </Card>

      <Card accent="secondary">
        <div className="profile-danger">
          <div>
            <h3>Sair da Conta</h3>
            <p>Você será desconectado do aplicativo</p>
          </div>
          <Button 
            variant="danger" 
            icon={<LogOut size={18} />}
            onClick={logout}
          >
            Sair
          </Button>
        </div>
      </Card>
    </div>
  );
}
