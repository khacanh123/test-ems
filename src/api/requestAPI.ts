import { RequestAPIParams } from 'types';
import customAxios from 'utils/customAxios';
import { generateRoutePath } from 'utils/utils';
import { notify as Notify } from './../utils/notify';
import { PathAPI } from './route';

export const RequestAPI = (data: RequestAPIParams) => {
  const { url, method, params, pagination, payload, notify, hiddenMessage } = data;
  // convert objec to a query string
  const pathFomated = generateRoutePath(url, params, pagination);
  return customAxios
    .request({
      url: pathFomated,
      method,
      data: payload,
    })
    .then((res) => {
      // console.log('requestAPIIIIII', res);
      if (notify && res.status) {
        Notify({ type: notify.type, message: notify.message });
      }
      return res;
    })
    .catch((err) => {
      if (!hiddenMessage || hiddenMessage === undefined) {
        Notify({ type: 'error', message: err.message });
      }
      console.log('REQUEST ERROR', err);
      throw err;
    });
};

export const getImageLink = (payload: any) => {
  const { img } = payload;
  const formData = new FormData();
  // Update the formData object => binary data
  formData.append('image', img, img.name);
  return customAxios
    .post(PathAPI.uploadFormdata, formData)
    .then((res: any) => {
      if (res.status) {
        Notify({ type: 'success', message: 'Tải ảnh lên thành công' });
        return res;
      }
    })
    .catch((err) => {
      console.log(err.message);
      Notify({ type: 'error', message: 'File tải lên không phải là file ảnh' });
      return err;
    });
};
