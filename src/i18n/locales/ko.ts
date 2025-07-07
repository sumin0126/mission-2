export default {
  // 브레드크럼브
  breadcrumb: {
    server: '서버',
    instance: '인스턴스',
  },

  // 인스턴스 페이지
  instance: {
    title: 'Instance',
    descriptions: [
      '생성한 인스턴스를 조회 및 관리하실 수 있습니다',
      '새로운 인스턴스를 생성하고 필요한 설정을 구성하실 수 있습니다',
      '선택한 인스턴스의 상세 정보를 확인하고 설정을 변경하실 수 있습니다',
    ],

    // 테이블 헤더
    table: {
      name: '인스턴스',
      powerStatus: '전원상태',
      cpu: 'CPU',
      memory: '메모리',
      disk: '디스크',
      ipAddress: 'IP 주소',
      powerManagement: '전원관리',
    },

    // 상태
    status: {
      running: 'RUNNING',
      shutdown: 'SHUTDOWN',
    },

    // 버튼
    actions: {
      delete: '삭제',
      create: '생성',
    },

    // 메시지
    messages: {
      deleteConfirm: '선택한 {count}개의 인스턴스를 삭제하시겠습니까?',
      deleteSuccess: '선택된 인스턴스들이 삭제되었습니다.',
    },
  },
}
