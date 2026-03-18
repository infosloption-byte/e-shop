import { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import { useToast } from '../../../context/ToastContext';

export default function SecurityTab() {
  const { showToast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, text: '', color: '' },
      { score: 1, text: 'Very Weak', color: 'bg-red-500' },
      { score: 2, text: 'Weak', color: 'bg-orange-500' },
      { score: 3, text: 'Fair', color: 'bg-yellow-500' },
      { score: 4, text: 'Good', color: 'bg-lime-500' },
      { score: 5, text: 'Strong', color: 'bg-emerald-500' }
    ];

    return strengths[score];
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'new_password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Please confirm your password';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setLoading(true);

    try {
      await api.put('/user/password', formData);
      
      showToast('Password changed successfully!', 'success');
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      setPasswordStrength({ score: 0, text: '', color: '' });
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      showToast(errorMsg, 'error');
      
      // Set specific field error if returned from backend
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (errorMsg.includes('current password')) {
        setErrors({ current_password: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-12">
        {/* Header */}
        <div className="mb-12">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Security Settings</h3>
          <p className="text-slate-500">Manage your account security and password</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Password Form */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Lock className="text-indigo-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Change Password</h4>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <PasswordField
                label="Current Password"
                name="current_password"
                value={formData.current_password}
                onChange={handlePasswordChange}
                error={errors.current_password}
                showPassword={showCurrentPassword}
                toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              />

              {/* New Password */}
              <div>
                <PasswordField
                  label="New Password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handlePasswordChange}
                  error={errors.new_password}
                  showPassword={showNewPassword}
                  toggleShow={() => setShowNewPassword(!showNewPassword)}
                />
                
                {/* Password Strength Indicator */}
                {formData.new_password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.text && (
                      <p className="text-xs text-slate-500">
                        Strength: <span className="font-bold">{passwordStrength.text}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <PasswordField
                label="Confirm New Password"
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handlePasswordChange}
                error={errors.new_password_confirmation}
                showPassword={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {/* Password Requirements */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-600 mb-2">Password Requirements:</p>
                <RequirementItem met={formData.new_password.length >= 8} text="At least 8 characters" />
                <RequirementItem met={/[a-z]/.test(formData.new_password) && /[A-Z]/.test(formData.new_password)} text="Upper and lowercase letters" />
                <RequirementItem met={/\d/.test(formData.new_password)} text="At least one number" />
                <RequirementItem met={/[^a-zA-Z0-9]/.test(formData.new_password)} text="At least one special character" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Info & Tips */}
          <div className="space-y-6">
            {/* Last Password Change */}
            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-emerald-500" size={24} />
                <h4 className="font-bold text-slate-900">Password Status</h4>
              </div>
              <p className="text-sm text-slate-600 mb-2">Your password is secure and up to date.</p>
              <p className="text-xs text-slate-400">Last changed: Never (or date from DB)</p>
            </div>

            {/* Security Tips */}
            <div className="bg-indigo-50 rounded-[2.5rem] border border-indigo-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-indigo-600" size={24} />
                <h4 className="font-bold text-indigo-900">Security Tips</h4>
              </div>
              <ul className="space-y-3 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>Use a unique password you don't use anywhere else</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>Change your password regularly (every 3-6 months)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>Never share your password with anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>Use a password manager for added security</span>
                </li>
              </ul>
            </div>

            {/* Two-Factor Authentication (Coming Soon) */}
            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 opacity-50">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-slate-400" size={24} />
                <h4 className="font-bold text-slate-600">Two-Factor Authentication</h4>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Add an extra layer of security to your account.
              </p>
              <button
                disabled
                className="px-6 py-3 bg-slate-200 text-slate-400 rounded-2xl font-bold cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, name, value, onChange, error, showPassword, toggleShow }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-4 pr-12 bg-white border rounded-2xl outline-none transition ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {error && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

function RequirementItem({ met, text }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
      )}
      <span className={`text-xs ${met ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
        {text}
      </span>
    </div>
  );
}