import jwt_decode from 'jwt-decode';

export interface decodeJWTType {
  email?: string;
  exp?: number;
  iat?: number;
  id?: string;
  type?: number;
}

export const decodeJWT = (token: string): any => {
  try {
    return jwt_decode(token);
  } catch (error) {
    return false;
  }
};

export const alphabet = (): string[] => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  return alphabet;
};

export const formatTimeString = (dateISO: string) => {
  const dateConverted = new Date(dateISO);
  let hours = dateConverted.getHours();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  let minutes = `0${dateConverted.getMinutes()}`.slice(-2);
  let seconds = `0${dateConverted.getSeconds()}`.slice(-2);
  let date = `0${dateConverted.getDate()}`.slice(-2);
  let month = `0${dateConverted.getMonth() + 1}`.slice(-2);
  let year = dateConverted.getFullYear();
  let current_day: number | string = dateConverted.getDay();
  const convertDay = (current_day: number | string) => {
    switch (current_day) {
      case 0:
        current_day = 'Chủ nhật';
        break;
      case 1:
        current_day = 'Thứ hai';
        break;
      case 2:
        current_day = 'Thứ ba';
        break;
      case 3:
        current_day = 'Thứ tư';
        break;
      case 4:
        current_day = 'Thứ năm';
        break;
      case 5:
        current_day = 'Thứ sáu';
        break;
      case 6:
        current_day = 'Thứ bảy';
    }
    return current_day;
  };
  let day = convertDay(current_day);
  return { year, month, date, day, hours, ampm, minutes, seconds };
};
export const getDateFromNow = (day: number) => {
  let result = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
  let date = `0${result.getDate()}`.slice(-2);
  let month = `0${result.getMonth() + 1}`.slice(-2);
  let year = result.getFullYear();
  return `${year}-${month}-${date}`;
};

export const getTimeMoment = (dateISO: string) => {
  const dateConverted = new Date(dateISO);
  let hours = dateConverted.getHours();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  let minutes = `0${dateConverted.getMinutes()}`.slice(-2);
  let seconds = `0${dateConverted.getSeconds()}`.slice(-2);
  let date = `0${dateConverted.getDate()}`.slice(-2);
  let month = `0${dateConverted.getMonth() + 1}`.slice(-2);
  let year = dateConverted.getFullYear();
  let current_day: number | string = dateConverted.getDay();
  const convertDay = (current_day: number | string) => {
    switch (current_day) {
      case 1:
        current_day = 'Thứ hai';
        break;
      case 2:
        current_day = 'Thứ ba';
        break;
      case 3:
        current_day = 'Thứ tư';
        break;
      case 4:
        current_day = 'Thứ năm';
        break;
      case 5:
        current_day = 'Thứ sáu';
        break;
      case 6:
        current_day = 'Thứ bảy';
        break;
      case 7:
        current_day = 'Chủ nhật';
    }
    return current_day;
  };
  let day = convertDay(current_day);
  return { year, month, date, day, hours, ampm, minutes, seconds };
};

export const generateRoutePath = (url: string, params: any, pagination: any) => {
  let urlFormatted = url;
  if (urlFormatted[urlFormatted.length - 1] === '/') {
    urlFormatted = urlFormatted.slice(0, -1);
  }
  if (params && pagination) {
    const queryParams = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    const queryPagination = `limit=${pagination?.pageSize}&page=${pagination?.pageIndex}`;

    urlFormatted = `${urlFormatted}?${queryParams}&${queryPagination}`;
  } else if (params) {
    const queryParams = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    urlFormatted = `${urlFormatted}?${queryParams}`;
  } else if (pagination) {
    const queryPagination = `limit=${pagination?.pageSize}&page=${pagination?.pageIndex}`;
    urlFormatted = `${urlFormatted}?${queryPagination}`;
  }
  return urlFormatted;
};

export const slug = (str: string) => {
  //Đổi chữ hoa thành chữ thường
  str = str.toLowerCase();

  //Đổi ký tự có dấu thành không dấu
  str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  str = str.replace(/đ/gi, 'd');
  str = str.replace(/[^a-zA-Z ]/g, '');
  //Xóa các ký tự đặt biệt
  str = str.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ''
  );
  //Đổi khoảng trắng thành ký tự gạch ngang
  str = str.replace(/ /gi, '-');
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  str = str.replace(/\-\-\-\-\-/gi, '-');
  str = str.replace(/\-\-\-\-/gi, '-');
  str = str.replace(/\-\-\-/gi, '-');
  str = str.replace(/\-\-/gi, '-');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  str = '@' + str + '@';
  str = str.replace(/\@\-|\-\@|\@/gi, '');

  return str;
};

export const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};
