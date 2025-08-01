const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '', component: () => import('pages/landingPage.vue') },
      { path: 'loginPage', component: () => import('pages/loginPage.vue') },
      { path: 'preRegCheck', component: () => import('pages/preRegCheck.vue') },
      { path: 'checkStatus', component: () => import('pages/checkStatus.vue') },
      { path: 'regOrIrreg', component: () => import('pages/regOrIrreg.vue') },
      { path: 'regularPreReg', component: () => import('pages/regularPreReg.vue') },
      { path: 'irregularpreReg', component: () => import('pages/irregularpreReg.vue') },
      { path: 'transactionPage', component: () => import('pages/transactionPage.vue') },
      { path: 'studentInfo', component: () => import('pages/studentInfo.vue') },
      { path: 'studentRegister', component: () => import('pages/studentRegister.vue') },
      { path: 'thankYou', component: () => import('pages/thankyouPage.vue') },
      { path: 'studentInfoInput', component: () => import('pages/studentInfoInput.vue') },
      { path: 'courseInfo', component: () => import('pages/courseInfo.vue') },
      { path: 'registerCourse/:userId', component: () => import('pages/registerCourse.vue') },
      { path: 'reviewInfo', component: () => import('pages/reviewInfo.vue') },
      { path: 'queuingPage/:queueId', component: () => import('src/pages/queuingPage.vue') },
      { path: 'adminLogin', component: () => import('src/pages/adminLogin.vue') },
      { path: 'publicMonitor', component: () => import('src/pages/publicMonitor.vue') },
      { path: 'queueCourse/:studentId', component: () => import('src/pages/queueCourse.vue') },
      { path: 'queueSummary/:queueId', component: () => import('src/pages/queueSummary.vue') },
      { path: 'textToSpeechPage', component: () => import('src/pages/textToSpeechPage.vue') },
      { path: 'testPage', component: () => import('src/pages/testPage.vue') },
    ],
  },
  {
    path: '/new',
    component: () => import('src/layouts/newLayout.vue'),
    children: [
      { path: 'dashboardPage', component: () => import('pages/dashboardPage.vue') },
      { path: 'addStudent', component: () => import('src/pages/addStudent.vue') },
      { path: 'addProgram', component: () => import('src/pages/addProgram.vue') },
      { path: 'addProgramPage', component: () => import('src/pages/addProgramPage.vue') },
      { path: 'addCourses', component: () => import('src/pages/addCourses.vue') },
      { path: 'queueAll', component: () => import('src/pages/backup/queueAll.vue') },
      { path: 'adminSettings', component: () => import('src/pages/adminSettings.vue') },
      { path: 'adminCreateAccount', component: () => import('src/pages/adminCreateAccount.vue') },
      { path: 'adminQueuePage', component: () => import('src/pages/adminQueuePage.vue') },
      { path: 'queueList', component: () => import('src/pages/queueList.vue') },
      { path: 'email', component: () => import('src/pages/emailPage.vue') },
      { path: 'verifyStudent', component: () => import('src/pages/nav/verifyStudent.vue') },
      { path: 'schedule', component: () => import('src/pages/nav/schedulePage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
