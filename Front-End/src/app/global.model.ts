/*
 * This is field model
 */
export class field {
  _id?: number
  name?: string
  type?: string
  icon?: string
  toggle?: string
  required?: boolean
  regex?: string
  errorText?: string
  label?: string
  description?: string
  placeholder?: string
  className?: string
  subtype?: string
  handle?: any
  min?: number
  max?: number
  inline?: any
  value?: string
  values?: value[]
}

export class value {
  label?: string = ''
  value?: string = ''
}

export interface IProperty {
  url?: string
  loading?: boolean
  itemsPerPage?: number
  total?: number
  p?: number
  sizeLimit?: number
  title?: string
  text?: string
  items?: string[]
  sub?: string
  isBlocked?: boolean
  isDeleted?: boolean
  isEmailVerified?: string
  successMsg?: string
  msg?: string
  userId?: string
  status?: number
  userPlaceholder?: string
  searchKey?: string
  fullName?: string
  email?: string
  countryCode?: string
  dialCode?: string
  phoneNumber?: string
  value?: Date
  data?: string
  name_es?: string
  name_en?: string
  countries?: string
  states?: string
  cities?: string
  countries1?: string
  states1?: string
  cities1?: string
  countries2?: string
  states2?: string
  cities2?: string
  localities?: string
  buildings?: string
  country_id?: string
  state_id?: string
  city_id?: string
  locality_id?: string
  building_id?: string
  countryCount?: number
  stateCount?: number
  cityCount?: number
  stateCityCount?: number
  localityCount?: number
  buildingCount?: number
  countriesAdd?: string
  statesAdd?: string
  citiesAdd?: string
  localitiesAdd?: string
  country_idAdd?: string
  state_idAdd?: string
  city_idAdd?: string
  locality_idAdd?: string
  countryCountAdd?: number
  stateCountAdd?: number
  cityCountAdd?: number
  localityCountAdd?: number
  successText?: string
  propertyTypes?: string
  propertyTypesCount?: number
  amenities?: string
  amenitiesCount?: number
  projectTypes?: string
  projectTypesCount?: number
  routeName?: string
  icon?: string
  userType?: string
  overlay?: string
  is_broker_seller_dev?: number
  is_buyer_renter?: number
  is_broker?: number
  is_data_collector?: number
  image?: string
  index?: number
  name?: string
  phone?: string
  type?: number
  property_id?: string
  banks?: any
  bankCount?: string
  flag?: number
  page?: number
  property_for?: string
  status_id?: string
  type_id?: string
  post_type?: string
  developer_id?: string
}
