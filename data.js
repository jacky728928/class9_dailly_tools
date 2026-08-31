/* =========================================================================
   班级管理数据文件 data.js
   说明：
   - 本文件是唯一需要维护的数据文件，由 index.html 通过 <script> 加载。
   - 既可在浏览器"设置"里编辑后自动回写，也可直接在此手动修改。
   - studentId 均指向 students[].id，便于改名不影响记录关联。
   ========================================================================= */
window.CLASS_DATA = {
  meta: {
    className: "高二（8）班",
    semester: "2026—2027学年秋季",
    updated: "2026-08-31",
    // 学科 → 标签色（可自定义，缺省走默认灰）
    subjectColors: {
      "语文": "#e05858",
      "数学": "#4a7cf0",
      "英语": "#2eaf7d",
      "物理": "#8b5cf6",
      "化学": "#f59e0b",
      "生物": "#14b8a6",
      "政治": "#d63384",
      "历史": "#a16207",
      "地理": "#06b6d4",
      "体育": "#84cc16",
      "音乐": "#ec4899",
      "美术": "#f97316",
      "班会": "#6366f1",
      "自习": "#94a3b8"
    }
  },

  // 学生名单
  students: [
    { id: 1,  name: "陈思远", studentNo: "01" },
    { id: 2,  name: "林雨桐", studentNo: "02" },
    { id: 3,  name: "周子轩", studentNo: "03" },
    { id: 4,  name: "黄诗涵", studentNo: "04" },
    { id: 5,  name: "赵宇辰", studentNo: "05" },
    { id: 6,  name: "沈梓涵", studentNo: "06" },
    { id: 7,  name: "刘梓豪", studentNo: "07" },
    { id: 8,  name: "王雨欣", studentNo: "08" },
    { id: 9,  name: "张子墨", studentNo: "09" },
    { id: 10, name: "李欣怡", studentNo: "10" }
  ],

  // 周课表：行=节次，列=周一~周五
  schedule: {
    periods: [
      { index: 1, time: "07:30-08:15" },
      { index: 2, time: "08:25-09:10" },
      { index: 3, time: "09:30-10:15" },
      { index: 4, time: "10:25-11:10" },
      { index: 5, time: "11:20-12:05" },
      { index: 6, time: "14:30-15:15" },
      { index: 7, time: "15:25-16:10" },
      { index: 8, time: "16:20-17:05" }
    ],
    days: {
      "周一": [
        { subject: "语文", teacher: "王老师" },
        { subject: "数学", teacher: "李老师" },
        { subject: "英语", teacher: "张老师" },
        { subject: "物理", teacher: "陈老师" },
        { subject: "化学", teacher: "刘老师" },
        { subject: "体育", teacher: "郑老师" },
        { subject: "自习", teacher: "" },
        { subject: "班会", teacher: "班主任" }
      ],
      "周二": [
        { subject: "数学", teacher: "李老师" },
        { subject: "语文", teacher: "王老师" },
        { subject: "英语", teacher: "张老师" },
        { subject: "化学", teacher: "刘老师" },
        { subject: "物理", teacher: "陈老师" },
        { subject: "生物", teacher: "赵老师" },
        { subject: "政治", teacher: "孙老师" },
        { subject: "自习", teacher: "" }
      ],
      "周三": [
        { subject: "英语", teacher: "张老师" },
        { subject: "数学", teacher: "李老师" },
        { subject: "语文", teacher: "王老师" },
        { subject: "生物", teacher: "赵老师" },
        { subject: "物理", teacher: "陈老师" },
        { subject: "地理", teacher: "吴老师" },
        { subject: "历史", teacher: "周老师" },
        { subject: "自习", teacher: "" }
      ],
      "周四": [
        { subject: "语文", teacher: "王老师" },
        { subject: "数学", teacher: "李老师" },
        { subject: "英语", teacher: "张老师" },
        { subject: "物理", teacher: "陈老师" },
        { subject: "化学", teacher: "刘老师" },
        { subject: "政治", teacher: "孙老师" },
        { subject: "历史", teacher: "周老师" },
        { subject: "自习", teacher: "" }
      ],
      "周五": [
        { subject: "数学", teacher: "李老师" },
        { subject: "语文", teacher: "王老师" },
        { subject: "英语", teacher: "张老师" },
        { subject: "物理", teacher: "陈老师" },
        { subject: "生物", teacher: "赵老师" },
        { subject: "体育", teacher: "郑老师" },
        { subject: "音乐", teacher: "钱老师" },
        { subject: "自习", teacher: "" }
      ]
    }
  },

  // 作业收交记录
  homework: [
    {
      id: "hw001",
      subject: "数学",
      title: "《课时练》P12-13",
      assignedDate: "2026-09-01",
      dueDate: "2026-09-03",
      submittedIds: [1, 2, 3, 5, 6, 8, 9]
    },
    {
      id: "hw002",
      subject: "语文",
      title: "背诵《劝学》全文",
      assignedDate: "2026-09-01",
      dueDate: "2026-09-02",
      submittedIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      id: "hw003",
      subject: "英语",
      title: "Unit 1 单词抄写两遍",
      assignedDate: "2026-09-02",
      dueDate: "2026-09-04",
      submittedIds: [1, 2, 3, 4, 5, 6, 7]
    }
  ],

  // 考勤：按日期键，每人一条状态记录（present 到 / absent 缺 / late 迟 / leave 请）
  attendance: {
    "2026-09-01": [
      { studentId: 1,  status: "present" },
      { studentId: 2,  status: "present" },
      { studentId: 3,  status: "present" },
      { studentId: 4,  status: "present" },
      { studentId: 5,  status: "late" },
      { studentId: 6,  status: "present" },
      { studentId: 7,  status: "present" },
      { studentId: 8,  status: "leave" },
      { studentId: 9,  status: "present" },
      { studentId: 10, status: "present" }
    ],
    "2026-09-02": [
      { studentId: 1,  status: "present" },
      { studentId: 2,  status: "present" },
      { studentId: 3,  status: "present" },
      { studentId: 4,  status: "present" },
      { studentId: 5,  status: "present" },
      { studentId: 6,  status: "present" },
      { studentId: 7,  status: "present" },
      { studentId: 8,  status: "absent" },
      { studentId: 9,  status: "present" },
      { studentId: 10, status: "present" }
    ]
  },

  // 卫生打扫排班：按周
  cleaning: {
    schedule: [
      {
        weekStart: "2026-09-01",
        weekLabel: "第1周",
        tasks: [
          { area: "教室地面", studentIds: [1, 2] },
          { area: "黑板与讲台", studentIds: [3] },
          { area: "走廊与楼梯", studentIds: [4, 5] },
          { area: "室外卫生区", studentIds: [6, 7] },
          { area: "倒垃圾", studentIds: [8] }
        ]
      },
      {
        weekStart: "2026-09-08",
        weekLabel: "第2周",
        tasks: [
          { area: "教室地面", studentIds: [9, 10] },
          { area: "黑板与讲台", studentIds: [1] },
          { area: "走廊与楼梯", studentIds: [2, 3] },
          { area: "室外卫生区", studentIds: [4, 5] },
          { area: "倒垃圾", studentIds: [6] }
        ]
      }
    ]
  }
};
