export const API_HOST = "https://blueskyapi.vacation.rentals/api";
// export const API_HOST = "https://rebuild.vacation.rentals/api";
export const GOOGLE_MAP_KEY = "AIzaSyA34nBk3rPJKXaNQaSX4YiLFoabX3DhkXs";
export const STRIPE_KEY = "pk_live_U8hqowvDTqTO4x1I7Wm67SUX00hjzdOcUZ";

export function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function clearCookie() {
  setCookie('is_loged_in', 'false', 0);
  setCookie('user_name', '', 0);
  setCookie('user_id', '', 0);
  setCookie('token', '', 0);
  setCookie('user_type', '', 0);
}

export function getAuthHeader() {
  const jwt_token = getCookie('token');
  if (jwt_token) {
    return {'Authorization': `Bearer ${jwt_token}`};
  }
  return {};
}

export function ajaxGet(url, no_auth) {
  if (no_auth) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json;charset=UTF-8', 
      }
    })
      .then( res => res.json() );
  }
  else {
    const headers = getAuthHeader();
    return fetch(url, {
      method: 'GET',
      headers: {...headers,
      'cache-control': 'no-cache',
      'Content-Type': 'application/json;charset=UTF-8', 
      }
    }).then( res => res.json() )
      .catch( () => {
        // clearCookie();
        // window.location.href='/';
      } );
  }
}

export function ajaxPost(url, data, no_auth) {
  if (no_auth) {
    return fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json;charset=UTF-8', 
      }
    })
      .then( res => res.json() );
  }
  else {
    const headers = getAuthHeader();
    return fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {...headers, 
      'cache-control': 'no-cache',
      'Content-Type': 'application/json;charset=UTF-8', 
      }
    })
      .then( res => res.json() )
      .catch( () => {
        // clearCookie(); 
        //window.location.href='/';
      } ); 
  }
}

export function ajaxPostForm(url, data, no_auth) {
  if (no_auth) {
    return fetch(url, {
      method: 'POST', 
      body: data,
      headers: {
        'cache-control': 'no-cache',
      }
    })
      .then( res => res.json() );
  }
  else {
    const headers = getAuthHeader();
    return fetch(url, {
      method: 'POST', 
      body: data,
      headers: {...headers, 
      'cache-control': 'no-cache',
      }
    })
      .then( res => res.json() )
      .catch( () => {
        // clearCookie(); 
        //window.location.href='/';
      } ); 
  }
}
