import { Mail, MapPin, Phone } from "lucide-react";

type Props = {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: string[];
  isNavigating: boolean;
};

const PersonalInfoStep = ({ formData, updateFormData, errors, isNavigating }: Props) => {
  const cities = [
    "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", 
    "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia", 
    "Khouribga", "El Jadida", "Beni Mellal", "Nador", "Taza", "Settat", 
    "Larache", "Ksar El Kebir", "Guelmim", "Laayoune", "Dakhla", "Other"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Please provide your personal details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your first name"
            disabled={isNavigating}
          />
          {errors.includes('First name is required') && (
            <p className="mt-1 text-sm text-red-600">First name is required</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your last name"
            disabled={isNavigating}
          />
          {errors.includes('Last name is required') && (
            <p className="mt-1 text-sm text-red-600">Last name is required</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-500 cursor-not-allowed focus:border-blue-500 disabled:opacity-75"
            disabled
          />
        </div>
        {errors.includes('Email is required') && (
          <p className="mt-1 text-sm text-red-600">Email is required</p>
        )}
        {errors.includes('Please enter a valid email address') && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+212 6XX-XXXXXX"
            disabled={isNavigating}
          />
        </div>
        {errors.includes('Phone number is required') ? 
          <p className="mt-1 text-sm text-red-600">Phone number is required</p> :
          errors.includes('Please enter a valid Moroccan phone number') && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid Moroccan phone number</p>
          )
        }
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            disabled={isNavigating}
          >
            <option value="">Select your city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        {errors.includes('City is required') && (
          <p className="mt-1 text-sm text-red-600">City is required</p>
        )}
      </div>
    </div>
  );
};
export default PersonalInfoStep;