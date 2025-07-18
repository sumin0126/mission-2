export default {
  // 브레드크럼브
  breadcrumb: {
    server: '서버',
    instance: '인스턴스',
  },

  // 인스턴스 페이지
  instance: {
    title: '인스턴스',
    network: {
      private: '내부 IP 자동 할당',
      public: '내부/외부 IP 자동 할당',
    },
    flavor: {
      c1m2d20: 'CPU 1코어 · 메모리 2GB · 디스크 20GB',
      c2m4d40: 'CPU 2코어 · 메모리 4GB · 디스크 40GB',
      c4m8d80: 'CPU 4코어 · 메모리 8GB · 디스크 80GB',
      c8m16d160: 'CPU 8코어 · 메모리 16GB · 디스크 160GB',
    },
    power: {
      shutdown: {
        message: '가상머신을 종료하시겠습니까?',
        warning: '종료 시, 실행 중인 모든 작업이 중단됩니다.',
        confirm: '종료',
      },
    },
    preview: {
      title: '선택된 사양 미리보기',
      name: '이름',
      image: '이미지',
      cpu: 'CPU',
      memory: '메모리',
      disk: '디스크',
      network: '네트워크',
    },
    list: {
      loading: '데이터를 불러오는 중...',
      table: {
        instance: '인스턴스',
        powerStatus: '전원상태',
        cpu: 'CPU',
        memory: '메모리',
        disk: '디스크',
        ipAddress: 'IP 주소',
        powerManagement: '전원관리',
        noData: '인스턴스가 없습니다.',
      },
      description: '생성한 인스턴스를 조회 및 관리하실 수 있습니다',
    },
    create: {
      description: '새로운 인스턴스를 생성합니다',
      form: {
        name: {
          label: '인스턴스 이름',
          placeholder: '이름을 입력해 주세요',
        },
        image: {
          label: '이미지',
          placeholder: '운영체제를 선택해 주세요',
        },
        flavor: {
          label: 'Flavor',
          placeholder: 'Flavor를 선택해 주세요',
        },
        network: {
          label: '네트워크',
          placeholder: '네트워크를 선택해 주세요',
        },
      },
      validation: {
        name: '인스턴스 이름을 입력해주세요',
        image: '이미지를 선택해주세요',
        flavor: 'Flavor를 선택해주세요',
        network: '네트워크를 선택해주세요',
        name_duplicate: {
          required: '중복 확인이 필요합니다',
          checking: '중복 확인 중...',
          available: '사용 가능한 인스턴스 이름입니다',
          duplicate: '이미 사용 중인 인스턴스 이름입니다',
          error: '중복 확인 중 오류가 발생했습니다',
        },
        name_length: {
          min: '인스턴스 이름은 최소 {min}자 이상이어야 합니다',
          max: '인스턴스 이름은 최대 {max}자까지 입력 가능합니다',
        },
        name_pattern: {
          no_spaces: '공백을 입력할 수 없습니다',
          invalid_chars: '영문자, 숫자, 하이픈(-), 언더스코어(_), 점(.)만 사용할 수 있습니다',
        },
      },
      button: {
        creating: '생성 중...',
        duplicateCheck: '중복 확인',
        checking: '확인 중...',
      },
      success: {
        message: '인스턴스 생성이 완료되었습니다',
      },
    },
    delete: {
      title: '인스턴스 삭제',
      message: '선택한 {count}개의 인스턴스를 삭제하시겠습니까?',
    },
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

    detail: {
      loading: '로딩 중...',
      deleteButton: {
        deleting: '삭제 중...',
        delete: '삭제',
      },
      deleteConfirm: {
        title: '알림',
        message: "'{name}' 인스턴스를 삭제하시겠습니까?",
      },
      error: {
        delete: '인스턴스를 삭제하는 중 오류가 발생했습니다.',
        deleteLog: '인스턴스 삭제 중 오류:',
      },

      basicInfo: {
        title: '기본 정보',
        name: '인스턴스 이름',
        image: '이미지',
        powerStatus: '전원 상태',
        error: {
          update: '인스턴스 정보 업데이트에 실패했습니다.',
          updateLog: '인스턴스 업데이트 중 오류:',
        },
      },

      resourceInfo: {
        title: '리소스 정보',
        cpu: 'CPU',
        memory: '메모리',
        disk: '디스크',
        unit: {
          core: '코어',
          gb: 'GB',
        },
        error: {
          update: '인스턴스 정보 업데이트에 실패했습니다.',
          updateLog: '인스턴스 업데이트 중 오류:',
          flavorNotFound: '선택된 flavor를 찾을 수 없습니다.',
        },
      },

      networkInfo: {
        title: '네트워크 정보',
        network: '네트워크',
        privateIp: '내부 IP',
        publicIp: '외부 IP',
        error: {
          update: '인스턴스 정보 업데이트에 실패했습니다.',
          updateLog: '인스턴스 업데이트 중 오류:',
        },
      },

      editBasicInfo: {
        title: '기본 정보',
        name: {
          label: '인스턴스 이름',
          placeholder: '인스턴스 이름을 입력하세요',
        },
        power: {
          label: '전원 관리',
          on: 'on',
          off: 'off',
        },
        button: {
          cancel: '취소',
          save: '저장',
        },
      },

      editResourceInfo: {
        title: '리소스 정보',
        resize: {
          label: '리사이징',
        },
        button: {
          cancel: '취소',
          save: '저장',
        },
      },

      editNetworkInfo: {
        title: '네트워크 정보',
        network: {
          label: '네트워크',
        },
        button: {
          cancel: '취소',
          save: '저장',
        },
      },
    },
  },
  common: {
    button: {
      delete: '삭제',
      create: '생성',
      cancel: '취소',
      confirm: '확인',
    },
    modal: {
      notification: '알림',
      dontShowToday: '오늘 하루동안 보지 않기',
    },
  },
}
