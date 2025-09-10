import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  DocumentMagnifyingGlassIcon,
  DocumentMinusIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FingerPrintIcon,
  FlagIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  GlobeAltIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  HashtagIcon,
  HeartIcon,
  HomeIcon,
  IdentificationIcon,
  InformationCircleIcon,
  KeyIcon,
  LinkIcon,
  ListBulletIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MegaphoneIcon,
  MinusCircleIcon,
  MinusIcon,
  PauseCircleIcon,
  PauseIcon,
  PencilIcon,
  PencilSquareIcon,
  PhoneIcon,
  PhotoIcon,
  PlusCircleIcon,
  PlusIcon,
  PresentationChartBarIcon,
  PrinterIcon,
  QrCodeIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  ServerStackIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SpeakerWaveIcon,
  StarIcon,
  TableCellsIcon,
  TagIcon,
  TrashIcon,
  TruckIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
  VideoCameraIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
  XMarkIcon,
  Bars3Icon,
  FunnelIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon
} from '@heroicons/vue/24/outline';

// Icônes solides
import {
  ArrowLeftIcon as ArrowLeftIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/vue/24/solid';

export const Icons = {
  // Icônes de navigation
  back: ArrowLeftIcon,
  close: XMarkIcon,
  menu: Bars3Icon,
  filter: FunnelIcon,
  sort: ArrowPathIcon,
  chevron: {
    up: ChevronUpIcon,
    down: ChevronDownIcon,
    left: ChevronLeftIcon,
    right: ChevronRightIcon,
  },
  
  // Icônes de documents
  document: {
    default: DocumentIcon,
    text: DocumentTextIcon,
    check: DocumentCheckIcon,
    add: DocumentPlusIcon,
    remove: DocumentMinusIcon,
    upload: ArrowUpTrayIcon,
    download: DocumentArrowDownIcon,
    duplicate: DocumentDuplicateIcon,
    search: DocumentMagnifyingGlassIcon,
    error: XMarkIcon, // Utilisation de XMarkIcon pour l'erreur de document
  },
  
  // Icônes d'action
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  checkBadge: CheckBadgeIcon,
  pencil: PencilIcon,
  pencilSquare: PencilSquareIcon,
  trash: TrashIcon,
  plus: PlusIcon,
  plusCircle: PlusCircleIcon,
  minus: MinusIcon,
  minusCircle: MinusCircleIcon,
  upload: ArrowUpTrayIcon,
  download: ArrowDownTrayIcon,
  search: MagnifyingGlassIcon,
  
  // Icônes de statut
  success: CheckCircleIconSolid,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  
  // Icônes de formulaire
  calendar: CalendarIcon,
  clock: ClockIcon,
  user: UserIcon,
  users: UsersIcon,
  userGroup: UserGroupIcon,
  userCircle: UserCircleIcon,
  lock: LockClosedIcon,
  unlock: LockOpenIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  
  // Icônes de navigation
  home: HomeIcon,
  settings: Cog6ToothIcon,
  
  // Icônes métier
  briefcase: BriefcaseIcon,
  building: BuildingOffice2Icon,
  currency: {
    dollar: CurrencyDollarIcon,
    euro: CurrencyEuroIcon,
  },
  
  // Icônes solides
  solid: {
    checkCircle: CheckCircleIconSolid,
    arrowLeft: ArrowLeftIconSolid,
  },
};

export type IconName = keyof typeof Icons | string;

export const getIcon = (name: IconName, variant: 'outline' | 'solid' = 'outline') => {
  // Si le nom contient un point, c'est un chemin d'accès imbriqué (ex: 'document.add')
  if (typeof name === 'string' && name.includes('.')) {
    const parts = name.split('.');
    let icon = Icons as any;
    
    for (const part of parts) {
      if (icon[part] === undefined) {
        console.warn(`Icon '${name}' not found`);
        return null;
      }
      icon = icon[part];
    }
    
    return icon;
  }
  
  // Recherche directe
  const icon = Icons[name as keyof typeof Icons];
  
  if (!icon) {
    console.warn(`Icon '${name}' not found`);
    return null;
  }
  
  return icon;
};

export default Icons;
