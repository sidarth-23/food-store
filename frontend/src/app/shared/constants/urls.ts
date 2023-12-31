import { environment } from 'src/environments/environment';

const BASE_URL = environment.production ? '' : 'http://localhost:5000';

export const FOODS_URL = BASE_URL + '/api/foods';
export const FOODS_TAGS_URL = FOODS_URL + '/tags';
export const FOODS_BY_SEARCH_URL = FOODS_URL + '/search/';
export const FOODS_BY_TAG_URL = FOODS_URL + '/tags/';
export const FOODS_BY_ID_URL = FOODS_URL + '/';


export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';
export const USER_GET_URL = BASE_URL + '/api/users/user';
export const USER_UPDATE_URL = BASE_URL + '/api/users/updateUser';
export const USER_UPDATE_PASS = BASE_URL + '/api/users/updatePass';
export const TOGGLE_FAVOURITES_URL = BASE_URL + '/api/users/editFavourite';

export const ORDER_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDER_URL + '/create';
export const ORDER_NEW_FOR_CURRENT_USER_URL =
  ORDER_URL + '/newOrderForCurrentUser';
export const ORDER_ALL_FOR_CURRENT_USER_URL = ORDER_URL + '/userOrders'
