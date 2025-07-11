export default {
  // Breadcrumb
  breadcrumb: {
    server: 'Server',
    instance: 'Instance',
  },

  // Instance page
  instance: {
    title: 'Instance',
    network: {
      private: 'Internal IP auto-assignment',
      public: 'Internal/External IP auto-assignment',
    },
    flavor: {
      c1m2d20: 'CPU 1 Core · Memory 2GB · Disk 20GB',
      c2m4d40: 'CPU 2 Cores · Memory 4GB · Disk 40GB',
      c4m8d80: 'CPU 4 Cores · Memory 8GB · Disk 80GB',
      c8m16d160: 'CPU 8 Cores · Memory 16GB · Disk 160GB',
    },
    power: {
      shutdown: {
        message: 'Are you sure you want to shut down the virtual machine?',
        warning: 'All running tasks will be interrupted when shut down.',
        confirm: 'Shutdown',
      },
    },
    preview: {
      title: 'Selected Specification Preview',
      name: 'Name',
      image: 'Image',
      cpu: 'CPU',
      memory: 'Memory',
      disk: 'Disk',
      network: 'Network',
    },
    list: {
      loading: 'Loading data...',
      table: {
        instance: 'Instance',
        powerStatus: 'Power Status',
        cpu: 'CPU',
        memory: 'Memory',
        disk: 'Disk',
        ipAddress: 'IP Address',
        powerManagement: 'Power Management',
        noData: 'No instances available.',
      },
      description: 'View and manage your created instances',
    },
    create: {
      description: 'Create a new instance',
      form: {
        name: {
          label: 'Instance Name',
          placeholder: 'Enter instance name',
        },
        image: {
          label: 'Image',
          placeholder: 'Select an operating system',
        },
        flavor: {
          label: 'Flavor',
          placeholder: 'Select a flavor',
        },
        network: {
          label: 'Network',
          placeholder: 'Select a network',
        },
      },
      validation: {
        name: 'Please enter instance name',
        image: 'Please select an image',
        flavor: 'Please select a flavor',
        network: 'Please select a network',
        name_duplicate: {
          required: 'Duplicate check is required',
          checking: 'Checking for duplicates...',
          available: 'This instance name is available',
          duplicate: 'This instance name is already in use',
          error: 'An error occurred while checking for duplicates',
        },
      },
      button: {
        creating: 'Creating...',
      },
      success: {
        message: 'Instance creation completed',
      },
    },
    delete: {
      title: 'Delete Instance',
      message: 'Are you sure you want to delete {count} selected instance(s)?',
    },
    descriptions: [
      'You can view and manage your created instances',
      'You can create new instances and configure necessary settings',
      'You can view detailed information of selected instances and modify settings',
    ],

    // Table headers
    table: {
      name: 'Instance',
      powerStatus: 'Power Status',
      cpu: 'CPU',
      memory: 'Memory',
      disk: 'Disk',
      ipAddress: 'IP Address',
      powerManagement: 'Power Management',
    },

    // Status
    status: {
      running: 'RUNNING',
      shutdown: 'SHUTDOWN',
    },

    // Buttons
    actions: {
      delete: 'Delete',
      create: 'Create',
    },

    // Messages
    messages: {
      deleteConfirm: 'Are you sure you want to delete {count} selected instances?',
      deleteSuccess: 'Selected instances have been deleted.',
    },

    detail: {
      loading: 'Loading...',
      deleteButton: {
        deleting: 'Deleting...',
        delete: 'Delete',
      },
      deleteConfirm: {
        title: 'Notification',
        message: "Are you sure you want to delete instance '{name}'?",
      },
      error: {
        delete: 'An error occurred while deleting the instance.',
        deleteLog: 'Error while deleting instance:',
      },

      basicInfo: {
        title: 'Basic Information',
        name: 'Instance Name',
        image: 'Image',
        powerStatus: 'Power Status',
        error: {
          update: 'Failed to update instance information.',
          updateLog: 'Error while updating instance:',
        },
      },

      resourceInfo: {
        title: 'Resource Information',
        cpu: 'CPU',
        memory: 'Memory',
        disk: 'Disk',
        unit: {
          core: 'Core',
          gb: 'GB',
        },
        error: {
          update: 'Failed to update instance information.',
          updateLog: 'Error while updating instance:',
          flavorNotFound: 'Selected flavor not found.',
        },
      },

      networkInfo: {
        title: 'Network Information',
        network: 'Network',
        privateIp: 'Private IP',
        publicIp: 'Public IP',
        error: {
          update: 'Failed to update instance information.',
          updateLog: 'Error while updating instance:',
        },
      },

      editBasicInfo: {
        title: 'Basic Information',
        name: {
          label: 'Instance Name',
          placeholder: 'Enter instance name',
        },
        power: {
          label: 'Power Management',
          on: 'on',
          off: 'off',
        },
        button: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },

      editResourceInfo: {
        title: 'Resource Information',
        resize: {
          label: 'Resizing',
        },
        button: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },

      editNetworkInfo: {
        title: 'Network Information',
        network: {
          label: 'Network',
        },
        button: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
    },
  },
  common: {
    button: {
      delete: 'Delete',
      create: 'Create',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    modal: {
      notification: 'Notification',
      dontShowToday: "Don't show today",
    },
  },
}
