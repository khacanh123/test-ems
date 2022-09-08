import LogoHOCMAI from 'assets/Logo.svg';
import ChPlay from 'assets/chplay.svg';
import AppStore from 'assets/appstore.svg';
import BoCongThuong from 'assets/bocongthuong.svg';
const Footer = () => {
  return (
    <>
      <div className='bg-[#F7FCFF] w-full px-[120px]' id='footer'>
        <div className='flex py-4 justify-around flex-nowrap'>
          <div className='w-80 pr-3'>
            <img src={LogoHOCMAI} alt='' />
            <div className='pt-1 text-[12px] font-bold text-black'>
              Công ty Cổ phần Đầu tư và Dịch vụ Giáo dục
            </div>
            <div className='mt-2 text-[10px]'>
              Văn phòng Hà Nội: Tầng 4, Tòa nhà 25T2, Đường Nguyễn Thị Thập, Phường Trung Hoà, Quận
              Cầu Giấy, Hà Nội.
            </div>
            <div className='mt-2 text-[10px]'>
              Văn phòng TP.HCM: 13M đường số 14 khu đô thị Miếu Nổi, Phường 3, Quận Bình Thạnh, TP.
              Hồ Chí Minh
            </div>
            <div className='mt-3'>
              <div className='text-[12px] font-bold text-black uppercase'>Tải ứng dụng</div>
              <div className='mt-2'>
                <img src={ChPlay} alt='' />
              </div>
              <div className='mt-2'>
                <img src={AppStore} alt='' />
              </div>
              <div className='mt-2'>
                <img src={BoCongThuong} alt='' />
              </div>
            </div>
          </div>
          <div className='w-36 pr-3'>
            <div className='text-[12px] font-bold text-black uppercase'>Về hocmai</div>
            <div className='mt-3 text-[10px]'>Giới thiệu</div>
            <div className='mt-2 text-[10px]'>Giáo viên nổi tiếng</div>
            <div className='mt-2 text-[10px]'>Học sinh tiêu biểu</div>
            <div className='mt-2 text-[10px]'>Điều khoản chính sách</div>
            <div className='mt-2 text-[10px]'>Quy chế hoạt động</div>
            <div className='mt-2 text-[10px]'>Chính sách bảo mật</div>
            <div className='mt-2 text-[10px]'>Giải quyết khiếu nại, tranh chấp</div>
            <div className='mt-2 text-[10px]'>Tuyển dụng</div>
          </div>
          <div className='w-44 pr-3'>
            <div className='text-[12px] font-bold text-black uppercase'>Dịch vụ</div>
            <div className='mt-3 text-[10px]'>Thư viện</div>
            <div className='mt-3 text-[10px]'>Ôn luyện</div>
            <div className='mt-3 text-[10px]'>Diễn dàn HOCMAI</div>
            <div className='mt-3 text-[10px]'>SpeakUp - Tiếng Anh 1 kèm 1 Online</div>
            <div className='mt-3 text-[10px]'>XiSo - Trường học lập trình trực tuyến</div>
          </div>
          <div className='w-36 pr-3'>
            <div className='text-[12px] font-bold text-black uppercase'>Hỗ trợ khách hàng</div>
            <div className='mt-3 text-[10px]'>Trung tâm hỗ trợ</div>
            <div className='mt-3 text-[10px]'>Email: hotro@hocmai.vn</div>
            <div className='mt-3 text-[10px]'>Đường dây nóng: 1900 6933</div>
          </div>
          <div className='w-36 pr-3'>
            <div className='text-[12px] font-bold text-black uppercase'>Dành cho đối tác</div>
            <div className='mt-3 text-[10px]'>Email: info@hocmai.vn</div>
            <div className='mt-3 text-[10px]'>Tel: +84 (24) 3519-0591</div>
            <div className='mt-3 text-[10px]'>Fax: +84 (24) 3519-0587</div>
          </div>
        </div>
      </div>
      <div className='bg-[#0474BC] w-full px-[120px]'>
        <div className='flex px-7 py-4 justify-between items-center flex-nowrap'>
          <div className='text-white text-[9px]'>
            MST: 0102183602 do Sở kế hoạch và Đầu tư thành phố Hà Nội cấp ngày 13 tháng 03 năm 2007
          </div>
          <div className='text-white text-[9px] w-80'>
            Giấy phép cung cấp dịch vụ mạng xã hội trực tuyến số 597/GP-BTTTT Bộ Thông tin và Truyền
            thông cấp ngày 30/12/2016.
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
