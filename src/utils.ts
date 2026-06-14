export function getCategoryStyles(category: string): string {
  switch (category.toLowerCase()) {
    case 'training':
      return 'text-indigo-700 bg-indigo-50 border-indigo-100';
    case 'design':
      return 'text-purple-700 bg-purple-50 border-purple-200/50';
    case 'meeting':
      return 'text-amber-700 bg-amber-50 border-amber-200/50';
    case 'wellness':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200/50';
    case 'social':
      return 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200/50';
    default:
      return 'text-neutral-700 bg-neutral-50 border-neutral-200/50';
  }
}

export function getStatusStyles(status: string): string {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'text-emerald-700 bg-emerald-55/10 border-emerald-200/40';
    case 'pending':
      return 'text-amber-700 bg-amber-55/10 border-amber-200/40';
    case 'declined':
      return 'text-rose-700 bg-rose-55/10 border-rose-200/40';
    default:
      return 'text-neutral-600 bg-neutral-100 border-neutral-200';
  }
}

// Generate initials from a name to show elegant placeholder avatars
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Get clean avatar gradient class
export function getAvatarGradient(name: string): string {
  const code = name.charCodeAt(0) % 5;
  switch (code) {
    case 0:
      return 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white';
    case 1:
      return 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white';
    case 2:
      return 'bg-gradient-to-br from-orange-400 to-rose-500 text-white';
    case 3:
      return 'bg-gradient-to-br from-sky-400 to-indigo-600 text-white';
    default:
      return 'bg-gradient-to-br from-pink-500 to-rose-600 text-white';
  }
}
