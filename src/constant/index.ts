export const questionFormTypes = {
  mathFormulaShow_types: [
    { value: '0', label: 'Không' },
    { value: '1', label: 'Có' },
  ],
};
export const constantDefault = {
  question: {
    quiz_type: [
      {
        title: 'Tự luận',
        value: 0,
      },
      {
        title: '1 đáp án',
        value: 1,
      },
      {
        title: 'Nhiều đáp án',
        value: 2,
      },
      {
        title: 'Yes/No',
        value: 3,
      },
      {
        title: 'Câu trả lời ngắn',
        value: 4,
      },
      {
        title: 'Ghép cặp',
        value: 5,
      },
      {
        title: 'Bài đọc',
        value: 6,
      },
      {
        title: 'Điền vào chỗ trống',
        value: 7,
      },
      {
        title: 'Sắp xếp',
        value: 8,
      },
    ],
    level: [
      {
        title: 'Dễ',
        value: 0,
      },
      {
        title: 'Trung bình',
        value: 1,
      },
      {
        title: 'Khó',
        value: 2,
      },
      {
        title: 'Cực khó',
        value: 3,
      },
    ],
    type: [
      {
        title: 'Lý thuyết',
        value: 0,
      },
      {
        title: 'Bài tập',
        value: 1,
      },
    ],
    awarenessLevel: [
      {
        title: 'Thông hiểu',
        value: 0,
      },
      {
        title: 'Nhận biết',
        value: 1,
      },
      {
        title: 'Vận dụng',
        value: 2,
      },
      {
        title: 'Vận dụng cao',
        value: 3,
      },
    ],
    answerType: [
      {
        title: 'Chữ',
        value: 0,
      },
      {
        title: 'Ảnh',
        value: 1,
      },
      {
        title: 'Audio',
        value: 2,
      },
    ],
  },
  test: {
    testType: [
      {
        title: 'Đề tĩnh',
        value: 0,
      },
      {
        title: 'Đề động',
        value: 1,
      },
      {
        title: 'Bộ đề điều kiện',
        value: 2,
      },
    ],
  },
  tag: {
    type: [
      {
        title: 'Tag cho câu hỏi',
        value: 0,
      },
      {
        title: 'Tag cho bộ đề',
        value: 1,
      },
    ],
  },
  baikiemtra: {
    resultReturnType: [
      {
        title: 'Trả về điểm',
        value: 0,
      },
      {
        title: 'Trả về điểm + đúng sai từng câu',
        value: 1,
      },
      {
        title: 'Trả về điểm + đúng sai + đáp án từng câu',
        value: 2,
      },
      {
        title: 'Trả về điểm + đúng sai + đáp án + hướng dẫn giải từng câu',
        value: 3,
      },
    ],
    testFormat: [
      {
        title: 'Kiểm tra nhanh',
        value: 0,
      },
      {
        title: 'Đề kiểm tra 15 phút',
        value: 1,
      },
      {
        title: 'Đề kiểm tra 45 phút',
        value: 2,
      },
      {
        title: 'Đề thi giữa kì',
        value: 3,
      },
      {
        title: 'Đề thi hết kì',
        value: 4,
      },
      {
        title: 'Đề thi cuối năm',
        value: 5,
      },
      {
        title: 'Bài thi HSA',
        value: 6,
      },
    ],
    testLevel: [
      {
        title: 'Dễ',
        value: 0,
      },
      {
        title: 'Trung bình',
        value: 1,
      },
      {
        title: 'Khó',
        value: 2,
      },
      {
        title: 'Cực khó',
        value: 3,
      },
    ],
  },
  file: {
    status: [
      {
        title: 'pending',
        value: 'pending',
      },
      {
        title: 'processing',
        value: 'processing',
      },
      {
        title: 'success',
        value: 'success',
      },
      {
        title: 'failed',
        value: 'failed',
      },
    ],
    statusMap: {
      pending: 'pending',
      processing: 'processing',
      success: 'success',
      failed: 'failed',
    },
    message: {
      pending: 'Đang chờ xử lí',
      processing: 'Đang xử lí',
      success: 'Thành công',
      failed: 'Thất bại',
    },
  },
};
