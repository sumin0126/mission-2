export default {
  // Breadcrumb
  breadcrumb: {
    server: 'Server',
    instance: 'Instance',
  },

  // Instance page
  instance: {
    title: 'Instance',
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
  },
}
