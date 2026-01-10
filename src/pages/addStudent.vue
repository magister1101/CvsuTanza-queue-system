<template>
  <q-page style="height: 90vh">
    <div class="main-container">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-weight-medium" style="color: #282726">
            Admin/<span style="color: #b1b2b4">Student</span>
          </div>
        </q-card-section>
        <!-- buttons add student/export -->
        <div class="button-container">
          <q-card-section class="button-section" v-if="isAdmin">
            <q-btn
              label="Add Student"
              no-caps
              @click="addStudentPopUp = true"
              flat
              class="action-button"
            />
          </q-card-section>

          <q-card-section class="button-section" v-if="isAdmin">
            <q-btn
              :label="'Import CSV Student'"
              no-caps
              @click="importStudentDialog = true"
              flat
              class="action-button"
            />
          </q-card-section>

          <q-card-section class="button-section" v-if="isAdmin">
            <q-btn
              :label="'Import CSV Grades'"
              no-caps
              @click="importGradesDialog = true"
              flat
              class="action-button"
            />
          </q-card-section>

          <q-card-section class="button-section">
            <q-btn label="Export CSV" no-caps @click="exportTable" flat class="action-button" />
          </q-card-section>

          <q-card-section class="button-section">
            <q-btn
              :label="'Current Semester: ' + semester"
              no-caps
              @click="changeSemster"
              flat
              class="action-button"
            />
          </q-card-section>
        </div>

        <!-- add student -->
        <div>
          <q-dialog v-model="addStudentPopUp" persistent>
            <q-card style="width: 900px; max-width: 95vw; max-height: 90vh" class="scroll">
              <q-form @submit.prevent="addStudent">
                <div class="q-pa-md">
                  <q-card-section class="text-h6 text-weight-medium" style="color: #282726">
                    Add Student
                  </q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">First Name</div>
                        <div class="input-field">
                          <q-input v-model="firstName" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Middle Name</div>
                        <div class="input-field">
                          <q-input v-model="middleName" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Last Name</div>
                        <div class="input-field">
                          <q-input v-model="lastName" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Student Number</div>
                        <div class="input-field">
                          <q-input v-model="studentNumber" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Email</div>
                        <div class="input-field">
                          <q-input v-model="email" type="email" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Program</div>
                        <div class="input-field">
                          <q-select
                            v-model="program"
                            type="text"
                            borderless
                            dense
                            :options="programOption.option"
                            option-value="value"
                            option-label="label"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Year</div>
                        <div class="input-field">
                          <q-select
                            v-model="year"
                            type="text"
                            borderless
                            dense
                            :options="yearOption.options"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Section</div>
                        <div class="input-field">
                          <q-select
                            v-model="section"
                            type="text"
                            borderless
                            dense
                            :options="sectionOption.options"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Status</div>
                        <div class="input-field">
                          <q-select
                            v-model="status"
                            type="text"
                            borderless
                            dense
                            :options="statusOption"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">House Number</div>
                        <div class="input-field">
                          <q-input v-model="houseNumber" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Street</div>
                        <div class="input-field">
                          <q-input v-model="street" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Barangay</div>
                        <div class="input-field">
                          <q-input v-model="barangay" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">City</div>
                        <div class="input-field">
                          <q-input v-model="city" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Province</div>
                        <div class="input-field">
                          <q-input v-model="province" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Sex</div>
                        <div class="input-field">
                          <q-select
                            v-model="sex"
                            type="text"
                            borderless
                            dense
                            :options="sexOptions"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Birth Date</div>
                        <div class="input-field">
                          <q-input v-model="birthDate" type="date" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Elementary School</div>
                        <div class="input-field">
                          <q-input v-model="elementarySchool" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">High School</div>
                        <div class="input-field">
                          <q-input v-model="highSchool" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Senior High School</div>
                        <div class="input-field">
                          <q-input v-model="seniorHighSchool" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">School Address</div>
                        <div class="input-field">
                          <q-input v-model="schoolAddress" type="text" borderless dense />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Indigenous</div>
                        <div class="input-field">
                          <q-select
                            v-model="isYouIndigenous"
                            type="text"
                            borderless
                            dense
                            :options="boolOpt.options"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">Disabled</div>
                        <div class="input-field">
                          <q-select
                            v-model="isDisabled"
                            type="text"
                            borderless
                            dense
                            :options="boolOpt.options"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">
                        <div class="text-subtitle2 q-mb-sm">First College Graduate</div>
                        <div class="input-field">
                          <q-select
                            v-model="isFirstCollegeGraduate"
                            type="text"
                            borderless
                            dense
                            :options="boolOpt.options"
                          />
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Close" @click="cancelAdd" color="red-8" class="q-px-md" />
                    <q-btn
                      :loading="loading"
                      type="submit"
                      flat
                      label="Add"
                      class="q-px-md"
                      style="background-color: #306b30; color: #ffffff; width: 100px"
                    />
                  </q-card-actions>
                </div>
              </q-form>
            </q-card>
          </q-dialog>
        </div>
        <!-- import dialog -->
        <div>
          <q-dialog v-model="importStudentDialog" persistent>
            <q-card class="q-pa-md" style="min-width: 350px; max-width: 40vw; width: 100%">
              <q-card-section>
                <div class="text-h6">Import Students</div>
                <div class="text-subtitle2 text-grey">Upload an Excel file (.xlsx or .xls)</div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <q-file
                  v-model="file"
                  @change="handleFileChange"
                  accept=".xlsx,.xls"
                  label="Choose Excel File"
                  filled
                  dense
                  bottom-slots
                  :clearable="!!file"
                  style="width: 100%"
                >
                  <template v-slot:append>
                    <q-icon name="upload" />
                  </template>
                </q-file>

                <div class="q-mt-md">
                  <q-btn
                    label="Upload"
                    color="primary"
                    :disable="!file || loadingImport"
                    @click="uploadFile"
                    class="full-width"
                  />
                </div>

                <div v-if="loadingImport" class="q-mt-md text-center">
                  <q-spinner-dots color="primary" size="md" />
                  <div class="text-caption q-mt-xs">Uploading...</div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat label="Close" @click="cancelImport" color="negative" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <!-- grades dialog -->
        <div>
          <q-dialog v-model="importGradesDialog" persistent>
            <q-card class="q-pa-md" style="min-width: 350px; max-width: 40vw; width: 100%">
              <q-card-section>
                <div class="text-h6">Import Students</div>
                <div class="text-subtitle2 text-grey">Upload an Excel file (.xlsx or .xls)</div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <q-file
                  v-model="file"
                  @change="handleFileChange"
                  accept=".xlsx,.xls"
                  label="Choose Excel File"
                  filled
                  dense
                  bottom-slots
                  :clearable="!!file"
                  style="width: 100%"
                >
                  <template v-slot:append>
                    <q-icon name="upload" />
                  </template>
                </q-file>

                <div class="q-mt-md">
                  <q-btn
                    label="Upload"
                    color="primary"
                    :disable="!file || loadingImport"
                    @click="uploadFileGrades"
                    class="full-width"
                  />
                </div>

                <div v-if="loadingImport" class="q-mt-md text-center">
                  <q-spinner-dots color="primary" size="md" />
                  <div class="text-caption q-mt-xs">Uploading...</div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat label="Close" @click="cancelImport" color="negative" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <!-- table -->
        <div class="q-mt-lg">
          <q-table
            :loading="tableLoading"
            style="border-radius: 12px; background-color: #fdffdf"
            title="Recent Students"
            :rows="rows"
            :columns="columns"
            row-key="id"
            separator="cell"
            :filter="filter"
            :rows-per-page-options="[0, 5, 10, 15, 20]"
            class="responsive-table"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary">
                <q-spinner-dots size="50px" />
              </q-inner-loading>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  v-for="col in columns"
                  :key="col.name"
                  :props="props"
                  :style="{ maxWidth: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }"
                >
                  <template v-if="col.name === '#'">
                    {{ props.rowIndex + 1 }}
                  </template>

                  <template v-else-if="col.name === 'action'">
                    <div class="row q-gutter-x-sm">
                      <q-btn-dropdown flat dropdown-icon="more_vert">
                        <q-list>
                          <div>
                            <q-btn
                              v-if="isAdmin"
                              @click="openViewDialog(props.row._id)"
                              label="View"
                              no-caps
                              flat
                              style="width: 100%"
                            />
                          </div>
                          <div>
                            <q-btn
                              v-if="isAdmin"
                              @click="openEditDialog(props.row)"
                              label="Edit"
                              no-caps
                              flat
                              style="width: 100%"
                            />
                          </div>
                          <div>
                            <q-btn
                              v-if="!props.row.isRegular"
                              @click="enrollCourse(props.row._id)"
                              style="width: 100%"
                              :loading="loading"
                              label="Enroll Courses"
                              no-caps
                              flat
                            />
                          </div>
                          <div>
                            <q-btn
                              @click="openDeleteDialog(props.row._id)"
                              style="width: 100%"
                              label="Delete"
                              no-caps
                              flat
                            />
                          </div>
                          <!-- <div>
                            <q-btn
                              @click="resetPassword(props.row._id)"
                              style="width: 100%"
                              :loading="loading"
                              label="Reset Password"
                              no-caps
                              flat
                            />
                          </div> -->
                          <div>
                            <q-btn
                              :loading="loading"
                              @click="sendEmail(props.row._id)"
                              label="Send Email"
                              style="width: 100%; color: green"
                              no-caps
                              flat
                              color="green"
                            />
                          </div>
                          <div>
                            <q-btn
                              :loading="loading"
                              @click="rejectEmail(props.row._id)"
                              label="Reject Email"
                              style="width: 100%; color: red"
                              no-caps
                              flat
                            />
                          </div>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </template>

                  <template v-else-if="col.name === 'courses'">
                    <!-- Display course codes as a comma-separated string -->
                    {{ props.row.courses?.map((course) => course.courseId?.code).join(', ') }}
                  </template>

                  <template v-else>
                    {{
                      typeof col.field === 'function' ? col.field(props.row) : props.row[col.name]
                    }}
                  </template>
                </q-td>
              </q-tr>
            </template>

            <template v-slot:top-left>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <!-- delete dialog -->
    <template>
      <q-dialog v-model="deleteDialog">
        <q-card style="min-width: 300px">
          <q-card-section class="text-h6">Confirm Delete</q-card-section>
          <q-card-section>Are you sure you want to delete this student?</q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="red-8" v-close-popup />
            <q-btn
              flat
              label="Delete"
              :loading="loading"
              style="background-color: #306b30; color: #ffffff"
              @click="confirmDelete(selectedStudentId.value)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
    <!-- Edit dialog -->
    <q-dialog v-model="editStudentInfo" persistent>
      <q-card style="width: 900px; max-width: 95vw; max-height: 90vh" class="scroll">
        <q-form @submit.prevent="editStudent(selectedStudentId)">
          <div class="q-pa-md">
            <q-card-section class="text-h6 text-weight-medium" style="color: #282726">
              Edit Student Info
            </q-card-section>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">First Name</div>
                  <div class="input-field">
                    <q-input v-model="editForm.firstName" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Middle Name</div>
                  <div class="input-field">
                    <q-input v-model="editForm.middleName" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Last Name</div>
                  <div class="input-field">
                    <q-input v-model="editForm.lastName" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Student Number</div>
                  <div class="input-field">
                    <q-input v-model="editForm.studentId" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Email</div>
                  <div class="input-field">
                    <q-input v-model="editForm.email" type="email" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Program</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.program"
                      type="text"
                      borderless
                      dense
                      :options="programOption.option"
                      option-value="value"
                      option-label="label"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Year</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.year"
                      type="text"
                      borderless
                      dense
                      :options="editYearOption.options"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Section</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.section"
                      type="text"
                      borderless
                      dense
                      :options="editSectionOption.options"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Status</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.status"
                      type="text"
                      borderless
                      dense
                      :options="editStatusOption"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">House Number</div>
                  <div class="input-field">
                    <q-input v-model="editForm.houseNumber" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Street</div>
                  <div class="input-field">
                    <q-input v-model="editForm.street" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Barangay</div>
                  <div class="input-field">
                    <q-input v-model="editForm.barangay" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">City</div>
                  <div class="input-field">
                    <q-input v-model="editForm.city" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Province</div>
                  <div class="input-field">
                    <q-input v-model="editForm.province" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Sex</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.sex"
                      type="text"
                      borderless
                      dense
                      :options="sexOptions"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Birth Date</div>
                  <div class="input-field">
                    <q-input v-model="editForm.birthDate" type="date" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Elementary School</div>
                  <div class="input-field">
                    <q-input v-model="editForm.elementarySchool" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">High School</div>
                  <div class="input-field">
                    <q-input v-model="editForm.highSchool" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Senior High School</div>
                  <div class="input-field">
                    <q-input v-model="editForm.seniorHighSchool" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">School Address</div>
                  <div class="input-field">
                    <q-input v-model="editForm.schoolAddress" type="text" borderless dense />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Indigenous</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.isYouIndigenous"
                      type="text"
                      borderless
                      dense
                      :options="boolOpt.options"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">Disabled</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.isDisabled"
                      type="text"
                      borderless
                      dense
                      :options="boolOpt.options"
                    />
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 q-mb-sm">First College Graduate</div>
                  <div class="input-field">
                    <q-select
                      v-model="editForm.isFirstCollegeGraduate"
                      type="text"
                      borderless
                      dense
                      :options="boolOpt.options"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup color="red-8" class="q-px-md" />
              <q-btn
                :loading="loading"
                type="submit"
                flat
                label="Save"
                class="q-px-md"
                style="background-color: #306b30; color: #ffffff; width: 100px"
              />
            </q-card-actions>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- Student info -->
    <q-dialog v-model="studentInfoDialog" persistent>
      <q-card style="min-width: 500px; max-width: 90vw; max-height: 90vh" class="q-pa-md scroll">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="person" class="q-mr-sm" />
          <div class="text-h6">Student Information</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-list bordered separator>
            <q-item v-if="selectedStudent.studentNumber">
              <q-item-section>
                <q-item-label><strong>Student Number:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.studentNumber }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label><strong>Name:</strong></q-item-label>
                <q-item-label caption>
                  {{ selectedStudent.firstName }} {{ selectedStudent.middleName }}
                  {{ selectedStudent.lastName }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.username">
              <q-item-section>
                <q-item-label><strong>Username:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.username }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.email">
              <q-item-section>
                <q-item-label><strong>Email:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.email }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label><strong>Course:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.course }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label><strong>Year:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.year }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label><strong>Section:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.section }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label><strong>Regular:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.isRegular ? 'Yes' : 'No' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label><strong>Status:</strong></q-item-label>
                <q-item-label caption>{{
                  selectedStudent.isArchived ? 'Archived' : 'Active'
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.houseNumber">
              <q-item-section>
                <q-item-label><strong>House Number:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.houseNumber }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.street">
              <q-item-section>
                <q-item-label><strong>Street:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.street }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.barangay">
              <q-item-section>
                <q-item-label><strong>Barangay:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.barangay }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.city">
              <q-item-section>
                <q-item-label><strong>City:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.city }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.province">
              <q-item-section>
                <q-item-label><strong>Province:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.province }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.sex">
              <q-item-section>
                <q-item-label><strong>Sex:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.sex }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.birthDate">
              <q-item-section>
                <q-item-label><strong>Birth Date:</strong></q-item-label>
                <q-item-label caption>{{
                  new Date(selectedStudent.birthDate).toLocaleDateString()
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.elementarySchool">
              <q-item-section>
                <q-item-label><strong>Elementary School:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.elementarySchool }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.highSchool">
              <q-item-section>
                <q-item-label><strong>High School:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.highSchool }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.seniorHighSchool">
              <q-item-section>
                <q-item-label><strong>Senior High School:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.seniorHighSchool }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.schoolAddress">
              <q-item-section>
                <q-item-label><strong>School Address:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.schoolAddress }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.isYouIndigenous !== undefined">
              <q-item-section>
                <q-item-label><strong>Indigenous:</strong></q-item-label>
                <q-item-label caption>{{
                  selectedStudent.isYouIndigenous ? 'Yes' : 'No'
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.isDisabled !== undefined">
              <q-item-section>
                <q-item-label><strong>Disabled:</strong></q-item-label>
                <q-item-label caption>{{ selectedStudent.isDisabled ? 'Yes' : 'No' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.isFirstCollegeGraduate !== undefined">
              <q-item-section>
                <q-item-label><strong>First College Graduate:</strong></q-item-label>
                <q-item-label caption>{{
                  selectedStudent.isFirstCollegeGraduate ? 'Yes' : 'No'
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedStudent.createdAt">
              <q-item-section>
                <q-item-label><strong>Created At:</strong></q-item-label>
                <q-item-label caption>{{
                  new Date(selectedStudent.createdAt).toLocaleString()
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Courses and Grades -->
          <div v-if="selectedStudent.courses?.length" class="q-mt-md">
            <div class="text-subtitle1 q-mb-sm"><strong>Courses and Grades</strong></div>
            
            <!-- Semester Tabs -->
            <q-tabs v-model="selectedGradeTab" class="text-grey q-mb-md" active-color="primary" indicator-color="primary" align="justify">
              <q-tab name="first" label="First Semester" />
              <q-tab name="second" label="Second Semester" />
              <q-tab name="summer" label="Summer" />
              <q-tab name="all" label="All" />
            </q-tabs>

            <!-- Year Level Filter -->
            <div class="q-mb-md">
              <q-btn-toggle
                v-model="selectedYearFilter"
                toggle-color="primary"
                :options="[
                  { label: 'All Years', value: 'all' },
                  { label: 'First Year', value: 'First' },
                  { label: 'Second Year', value: 'Second' },
                  { label: 'Third Year', value: 'Third' },
                  { label: 'Fourth Year', value: 'Fourth' }
                ]"
                class="full-width"
              />
            </div>

            <q-tab-panels v-model="selectedGradeTab" animated>
              <!-- First Semester -->
              <q-tab-panel name="first">
                <q-table
                  flat
                  dense
                  :rows="firstSemesterCourses"
                  :columns="gradeColumns"
                  :row-key="(row) => `${row.courseId?._id}-${row.sem}-${row.year}`"
                  :loading="!selectedStudent.courses"
                >
                  <template v-slot:body-cell-grade="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.value)"
                        text-color="white"
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-description="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.row.grade)"
                        text-color="white"
                        outline
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <!-- Second Semester -->
              <q-tab-panel name="second">
                <q-table
                  flat
                  dense
                  :rows="secondSemesterCourses"
                  :columns="gradeColumns"
                  :row-key="(row) => `${row.courseId?._id}-${row.sem}-${row.year}`"
                  :loading="!selectedStudent.courses"
                >
                  <template v-slot:body-cell-grade="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.value)"
                        text-color="white"
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-description="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.row.grade)"
                        text-color="white"
                        outline
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <!-- Summer Semester -->
              <q-tab-panel name="summer">
                <q-table
                  flat
                  dense
                  :rows="summerSemesterCourses"
                  :columns="gradeColumns"
                  :row-key="(row) => `${row.courseId?._id}-${row.sem}-${row.year}`"
                  :loading="!selectedStudent.courses"
                >
                  <template v-slot:body-cell-grade="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.value)"
                        text-color="white"
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-description="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.row.grade)"
                        text-color="white"
                        outline
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <!-- All Grades -->
              <q-tab-panel name="all">
                <q-table
                  flat
                  dense
                  :rows="allCoursesFiltered"
                  :columns="gradeColumns"
                  :row-key="(row) => `${row.courseId?._id}-${row.sem}-${row.year}`"
                  :loading="!selectedStudent.courses"
                >
                  <template v-slot:body-cell-grade="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.value)"
                        text-color="white"
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-description="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getGradeColor(props.row.grade)"
                        text-color="white"
                        outline
                        class="q-px-md"
                      >
                        {{ props.value }}
                      </q-badge>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Notify, exportFile } from 'quasar'
import { useRouter } from 'vue-router'
import axios from 'axios'

// loading
const loading = ref(false)

//router
const router = useRouter()

//value
const semester = ref('')
const semesterData = ref([])
const selectedStudent = ref('')
const selectedGradeTab = ref('all')
const selectedYearFilter = ref('all')

// dialogs
const studentInfoDialog = ref(false)
const addStudentPopUp = ref(false)
const importStudentDialog = ref(false)
const importGradesDialog = ref(false)
const editStudentInfo = ref(false)
const deleteDialog = ref(false)

// Form fields
const studentNumber = ref('')
const email = ref('')
const username = ref('')
const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const program = ref('')
const programOption = ref({})
const year = ref('')
const yearOption = ref({
  options: ['First', 'Second', 'Third', 'Fourth'],
})
const section = ref('')
const sectionOption = ref({
  options: ['1', '2', '3', '4', '5', '6', '7'],
})
const boolOpt = ref({
  options: ['true', 'false'],
})
const statusOption = ref(['Regular', 'Irregular'])
const status = ref('Regular')
const houseNumber = ref('')
const street = ref('')
const barangay = ref('')
const city = ref('')
const province = ref('')
const sex = ref('')
const sexOptions = ['Male', 'Female', 'Other']
const birthDate = ref('')
const elementarySchool = ref('')
const highSchool = ref('')
const seniorHighSchool = ref('')
const schoolAddress = ref('')
const isYouIndigenous = ref('false')
const isDisabled = ref('false')
const isFirstCollegeGraduate = ref('false')
const role = ref('student')

// Edit form
const editForm = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  studentId: '',
  originalStudentNumber: '', // Store original studentNumber to detect changes
  email: '',
  program: '',
  year: '',
  section: '',
  status: '',
  houseNumber: '',
  street: '',
  barangay: '',
  city: '',
  province: '',
  sex: '',
  birthDate: '',
  elementarySchool: '',
  highSchool: '',
  seniorHighSchool: '',
  schoolAddress: '',
  isYouIndigenous: 'false',
  isDisabled: 'false',
  isFirstCollegeGraduate: 'false',
})

//file
const file = ref(null)
const loadingImport = ref(false)

const roleValidation = ref('')
const isAdmin = ref('true')
const editYearOption = ref({
  options: ['First', 'Second', 'Third', 'Fourth'],
})
const editSectionOption = ref({
  options: ['1', '2', '3', '4', '5', '6', '7'],
})
const editStatusOption = ref(['Regular', 'Irregular'])

const tableLoading = ref(false)

const selectedStudentId = ref(null)

async function cancelAdd() {
  firstName.value = ''
  middleName.value = ''
  lastName.value = ''
  email.value = ''
  studentNumber.value = ''
  program.value = ''
  year.value = ''
  section.value = ''
  status.value = 'Regular'
  houseNumber.value = ''
  street.value = ''
  barangay.value = ''
  city.value = ''
  province.value = ''
  sex.value = ''
  birthDate.value = ''
  elementarySchool.value = ''
  highSchool.value = ''
  seniorHighSchool.value = ''
  schoolAddress.value = ''
  isYouIndigenous.value = 'false'
  isDisabled.value = 'false'
  isFirstCollegeGraduate.value = 'false'
  addStudentPopUp.value = false
}

async function cancelImport() {
  file.value = ''
  importStudentDialog.value = false
  importGradesDialog.value = false
}

async function addStudent() {
  loading.value = true
  try {
    if (
      !firstName.value ||
      !lastName.value ||
      !studentNumber.value ||
      !email.value ||
      !program.value ||
      !year.value ||
      !section.value ||
      !status.value
    ) {
      Notify.create({
        type: 'negative',
        message: 'Please fill in all required fields',
      })
      loading.value = false
      return
    }
    const isRegular = status.value === 'Regular'
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/create`,
      {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        role: 'student',
        username: studentNumber.value,
        email: email.value,
        studentNumber: studentNumber.value,
        course: program.value,
        year: year.value,
        section: section.value,
        isRegular: isRegular,
        houseNumber: houseNumber.value,
        street: street.value,
        barangay: barangay.value,
        city: city.value,
        province: province.value,
        sex: sex.value,
        birthDate: birthDate.value,
        elementarySchool: elementarySchool.value,
        highSchool: highSchool.value,
        seniorHighSchool: seniorHighSchool.value,
        schoolAddress: schoolAddress.value,
        isYouIndigenous: isYouIndigenous.value === 'true',
        isDisabled: isDisabled.value === 'true',
        isFirstCollegeGraduate: isFirstCollegeGraduate.value === 'true',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    // console.log(response.data)
    getAllStudents()
    Notify.create({
      type: 'positive',
      message: 'Student added successfully',
    })
    cancelAdd()
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Something Went Wrong',
    })
  } finally {
    loading.value = false
    addStudentPopUp.value = false
  }
}

const handleFileChange = (event) => {
  // Capture the selected file
  file.value = event.target.files[0]
}

const uploadFile = async () => {
  if (!file.value) return

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    loadingImport.value = true

    const response = await axios.post(
      `${process.env.api_host}/users/excel/insertStudents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    Notify.create({
      type: 'positive',
      message: 'File uploaded successfully',
    })
    getAllStudents()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to upload file',
    })
  } finally {
    importStudentDialog.value = false
    loadingImport.value = false
    file.value = null
  }
}

const uploadFileGrades = async () => {
  if (!file.value) return

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    loadingImport.value = true

    const response = await axios.post(
      `${process.env.api_host}/users/excel/insertGrades`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    Notify.create({
      type: 'positive',
      message: 'File uploaded successfully',
    })
    getAllStudents()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to upload file',
    })
  } finally {
    importGradesDialog.value = false
    loadingImport.value = false
    file.value = null
  }
}

// table
const filter = ref('')
const columns = ref([
  {
    name: '#',
    required: true,
    label: '#',
    align: 'center',
    field: 'index',
    sortable: true,
  },
  {
    name: 'studentNumber',
    required: true,
    label: 'Student Number',
    align: 'left',
    field: (row) => row.studentNumber,
    sortable: true,
  },
  {
    name: 'fullName',
    align: 'left',
    label: 'Student Name',
    field: (row) => `${row.firstName} ${row.middleName} ${row.lastName}`,
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: true,
  },
  {
    name: 'username',
    align: 'left',
    label: 'Username',
    field: 'username',
  },
  {
    name: 'course',
    align: 'left',
    label: 'Program',
    field: 'course',
    sortable: true,
  },
  {
    name: 'year',
    align: 'left',
    label: 'Year',
    field: 'year',
    sortable: true,
  },
  {
    name: 'section',
    align: 'left',
    label: 'Section',
    field: 'section',
    sortable: true,
  },
  {
    name: 'status',
    align: 'left',
    label: 'Status',
    field: (row) => (row.isRegular ? 'Regular' : 'Irregular'),
    sortable: true,
  },
  {
    name: 'houseNumber',
    align: 'left',
    label: 'House Number',
    field: 'houseNumber',
    sortable: true,
  },
  {
    name: 'street',
    align: 'left',
    label: 'Street',
    field: 'street',
    sortable: true,
  },
  {
    name: 'barangay',
    align: 'left',
    label: 'Barangay',
    field: 'barangay',
    sortable: true,
  },
  {
    name: 'city',
    align: 'left',
    label: 'City',
    field: 'city',
    sortable: true,
  },
  {
    name: 'province',
    align: 'left',
    label: 'Province',
    field: 'province',
    sortable: true,
  },
  {
    name: 'sex',
    align: 'left',
    label: 'Sex',
    field: 'sex',
    sortable: true,
  },
  {
    name: 'birthDate',
    align: 'left',
    label: 'Birth Date',
    field: (row) => {
      if (!row.birthDate) return ''
      return new Date(row.birthDate).toLocaleDateString('en-CA')
    },
    sortable: true,
  },
  {
    name: 'elementarySchool',
    align: 'left',
    label: 'Elementary School',
    field: 'elementarySchool',
    sortable: true,
  },
  {
    name: 'highSchool',
    align: 'left',
    label: 'High School',
    field: 'highSchool',
    sortable: true,
  },
  {
    name: 'seniorHighSchool',
    align: 'left',
    label: 'Senior High School',
    field: 'seniorHighSchool',
    sortable: true,
  },
  {
    name: 'schoolAddress',
    align: 'left',
    label: 'School Address',
    field: 'schoolAddress',
    sortable: true,
  },
  {
    name: 'isYouIndigenous',
    align: 'left',
    label: 'Indigenous',
    field: (row) => (row.isYouIndigenous ? 'Yes' : 'No'),
    sortable: true,
  },
  {
    name: 'isDisabled',
    align: 'left',
    label: 'Disabled',
    field: (row) => (row.isDisabled ? 'Yes' : 'No'),
    sortable: true,
  },
  {
    name: 'isFirstCollegeGraduate',
    align: 'left',
    label: 'First College Graduate',
    field: (row) => (row.isFirstCollegeGraduate ? 'Yes' : 'No'),
    sortable: true,
  },
  {
    name: 'action',
    align: 'left',
    label: 'Action',
    field: 'action',
  },
])

const rows = ref([])

async function getSemester() {
  try {
    const response = await axios.get(`${process.env.api_host}/courses/getSemester`)
    // console.log(response.data[0].semester)
    semester.value = response.data[0].semester
    semesterData.value = response.data
  } catch (err) {
    // console.error(err)
  }
}

async function changeSemster() {
  try {
    const id = semesterData.value[0]._id

    const response = await axios.post(`${process.env.api_host}/courses/changeSemester/${id}`)
    getSemester()
  } catch (err) {
    // console.error(err)
  }
}

async function getAllStudents() {
  tableLoading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const userResponse = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })

    if (
      userResponse.data.role === 'admin' ||
      userResponse.data.role === 'admission' ||
      userResponse.data.role === 'cashier' ||
      userResponse.data.role === 'registrar'
    ) {
      const response = await axios.get(
        `${process.env.api_host}/users?role=student&isArchived=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      )
      if (response.data && Array.isArray(response.data)) {
        rows.value = response.data
      } else {
        // console.error('Invalid response format:', response)
        rows.value = []
        Notify.create({
          type: 'negative',
          message: 'Invalid data format received from server',
        })
      }
    } else {
      const response = await axios.get(
        `${process.env.api_host}/users?role=student&program=${userResponse.data.role}&year=${userResponse.data.year}&isArchived=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      )
      if (response.data && Array.isArray(response.data)) {
        rows.value = response.data
      } else {
        // console.error('Invalid response format:', response)
        rows.value = []
        Notify.create({
          type: 'negative',
          message: 'Invalid data format received from server',
        })
      }
    }
  } catch (err) {
    // console.error(err)
    rows.value = []
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch students data',
    })
  } finally {
    tableLoading.value = false
  }
}

function openEditDialog(student) {
  const originalStudentNumber = student.studentNumber || student.username || ''
  editForm.value = {
    firstName: student.firstName || '',
    middleName: student.middleName || '',
    lastName: student.lastName || '',
    studentId: originalStudentNumber,
    originalStudentNumber: originalStudentNumber, // Store original to detect changes
    email: student.email || '',
    program: student.course || '',
    year: student.year || '',
    section: student.section || '',
    status: student.isRegular ? 'Regular' : 'Irregular',
    houseNumber: student.houseNumber || '',
    street: student.street || '',
    barangay: student.barangay || '',
    city: student.city || '',
    province: student.province || '',
    sex: student.sex || '',
    birthDate: student.birthDate ? student.birthDate.split('T')[0] : '',
    elementarySchool: student.elementarySchool || '',
    highSchool: student.highSchool || '',
    seniorHighSchool: student.seniorHighSchool || '',
    schoolAddress: student.schoolAddress || '',
    isYouIndigenous: student.isYouIndigenous ? 'true' : 'false',
    isDisabled: student.isDisabled ? 'true' : 'false',
    isFirstCollegeGraduate: student.isFirstCollegeGraduate ? 'true' : 'false',
    _id: student._id,
  }
  editStudentInfo.value = true
}

async function editStudent() {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    
    // Prepare update data
    const updateData = {
      firstName: editForm.value.firstName,
      middleName: editForm.value.middleName,
      lastName: editForm.value.lastName,
      studentNumber: editForm.value.studentId,
      email: editForm.value.email,
      course: editForm.value.program,
      year: editForm.value.year,
      section: editForm.value.section,
      isRegular: editForm.value.status === 'Regular',
      houseNumber: editForm.value.houseNumber,
      street: editForm.value.street,
      barangay: editForm.value.barangay,
      city: editForm.value.city,
      province: editForm.value.province,
      sex: editForm.value.sex,
      birthDate: editForm.value.birthDate,
      elementarySchool: editForm.value.elementarySchool,
      highSchool: editForm.value.highSchool,
      seniorHighSchool: editForm.value.seniorHighSchool,
      schoolAddress: editForm.value.schoolAddress,
      isYouIndigenous: editForm.value.isYouIndigenous === 'true',
      isDisabled: editForm.value.isDisabled === 'true',
      isFirstCollegeGraduate: editForm.value.isFirstCollegeGraduate === 'true',
    }
    
    // Update username and password when studentNumber changes
    // Username should match studentNumber
    if (editForm.value.studentId) {
      updateData.username = editForm.value.studentId
      // Password should also be set to studentNumber (backend will hash it)
      updateData.password = editForm.value.studentId
    }
    
    const response = await axios.post(
      `${process.env.api_host}/users/update/${editForm.value._id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )

    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Student information updated successfully',
      })
      getAllStudents()
    }
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to update student information',
    })
  } finally {
    loading.value = false
    editStudentInfo.value = false
  }
}

function openDeleteDialog(studentId) {
  selectedStudentId.value = studentId
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!selectedStudentId.value) return
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/update/${selectedStudentId.value}`,
      {
        isArchived: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Student deleted successfully',
      })
      await getAllStudents()
    }
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to delete student',
    })
  } finally {
    loading.value = false
    deleteDialog.value = false
    selectedStudentId.value = null
  }
}

async function openViewDialog(studentId) {
  loading.value = true
  try {
    studentInfoDialog.value = true
    selectedGradeTab.value = 'all' // Reset to 'all' tab when opening dialog
    selectedYearFilter.value = 'all' // Reset year filter when opening dialog

    const response = await axios.get(`${process.env.api_host}/users?query=${studentId}`)
    selectedStudent.value = response.data[0]
    // console.log('Selected student:', selectedStudent.value)
    // console.log('Student courses:', selectedStudent.value?.courses)
    // Debug: log semester info for each course
    // if (selectedStudent.value?.courses) {
    //   selectedStudent.value.courses.forEach((course, index) => {
    //     console.log(`Course ${index}:`, {
    //       code: course.courseId?.code,
    //       sem: course.sem,
    //       year: course.year,
    //       courseIdSemester: course.courseId?.semester,
    //       courseIdYear: course.courseId?.year
    //     })
    //   })
    // }
  } catch (error) {
    // console.error(error)
  } finally {
    loading.value = false
  }
}

async function enrollCourse(studentId) {
  loading.value = true
  try {
    const userResponse = await axios.get(`${process.env.api_host}/users?query=${studentId}`)

    if (userResponse.data[0].isRegular) {
      const enroll = await axios.post(`${process.env.api_host}/users/enrollRegular/${studentId}`, {
        semester: semester.value,
      })
      Notify.create({
        type: 'positive',
        message: 'Student successfully enrolled in the ' + semester.value + ' semester',
      })
      sendEmail(studentId)
      return
    } else {
      router.push(`/queueCourse/` + `${studentId}`)
    }
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to enroll course',
    })
  } finally {
    loading.value = false
  }
}

async function sendEmail(studentId) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/sendEmail/${studentId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Email sent successfully',
      })
    }
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to send email',
    })
  } finally {
    loading.value = false
  }
}

async function rejectEmail(studentId) {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
      `${process.env.api_host}/users/rejectEmail/${studentId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    )
    if (response.status === 200) {
      Notify.create({
        type: 'positive',
        message: 'Email sent successfully',
      })
    }
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to send email',
    })
  } finally {
    loading.value = false
  }
}

async function fetchPrograms() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(
      `${process.env.api_host}/courses/getProgram?isArchived=false`,
      {
        headers: {
          Authorization: token,
        },
      },
    )

    programOption.value = {
      option: response.data.map((program) => program.name),
    }
  } catch (err) {
    // console.error('Error fetching programs:', err)
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch programs',
    })
  }
}

async function userInfo() {
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${process.env.api_host}/users/myProfile`, {
      headers: {
        Authorization: token,
      },
    })
    roleValidation.value = response.data.role
    if (
      // roleValidation.value === 'registrar' ||
      roleValidation.value === 'admission' ||
      roleValidation.value === 'cashier'
    ) {
      return (isAdmin.value = false)
    }
  } catch (err) {
    // console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Error fetching user information',
    })
  }
}

// Modified export button function
function wrapCsvValue(val) {
  if (val === null || val === undefined) {
    return ''
  }

  let formatted = String(val)
  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}

function exportTable() {
  try {
    // Define export columns with all fields
    const exportColumns = [
      { label: 'No.', field: 'index' },
      { label: 'Student Number', field: 'studentNumber' },
      { label: 'First Name', field: 'firstName' },
      { label: 'Middle Name', field: 'middleName' },
      { label: 'Last Name', field: 'lastName' },
      { label: 'Username', field: 'username' },
      { label: 'Email', field: 'email' },
      { label: 'Program', field: 'course' },
      { label: 'Year', field: 'year' },
      { label: 'Section', field: 'section' },
      { label: 'Status', field: (row) => (row.isRegular ? 'Regular' : 'Irregular') },
      { label: 'House Number', field: 'houseNumber' },
      { label: 'Street', field: 'street' },
      { label: 'Barangay', field: 'barangay' },
      { label: 'City', field: 'city' },
      { label: 'Province', field: 'province' },
      { label: 'Sex', field: 'sex' },
      {
        label: 'Birth Date',
        field: (row) => (row.birthDate ? new Date(row.birthDate).toLocaleDateString('en-CA') : ''),
      },
      { label: 'Elementary School', field: 'elementarySchool' },
      { label: 'High School', field: 'highSchool' },
      { label: 'Senior High School', field: 'seniorHighSchool' },
      { label: 'School Address', field: 'schoolAddress' },
      { label: 'Indigenous', field: (row) => (row.isYouIndigenous ? 'Yes' : 'No') },
      { label: 'Disabled', field: (row) => (row.isDisabled ? 'Yes' : 'No') },
      {
        label: 'First College Graduate',
        field: (row) => (row.isFirstCollegeGraduate ? 'Yes' : 'No'),
      },
      {
        label: 'Courses',
        field: (row) =>
          row.courses
            ?.map((course) => course.courseId?.code)
            .filter(Boolean)
            .join(', ') || '',
      },
      {
        label: 'Grades',
        field: (row) =>
          row.courses
            ?.map((course) => course.grade)
            .filter(Boolean)
            .join(', ') || '',
      },
    ]

    // Create headers row
    const headers = exportColumns.map((col) => wrapCsvValue(col.label)).join(',')

    // Create data rows
    const dataRows = rows.value.map((row, index) => {
      const rowData = exportColumns.map((col) => {
        let value
        if (col.field === 'index') {
          value = index + 1
        } else if (typeof col.field === 'function') {
          value = col.field(row)
        } else {
          value = row[col.field] || ''
        }
        return wrapCsvValue(value)
      })
      return rowData.join(',')
    })

    // Combine headers and data
    const csvContent = [headers, ...dataRows].join('\r\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    Notify.create({
      type: 'positive',
      message: 'CSV exported successfully',
    })
  } catch (error) {
    // console.error('Error exporting CSV:', error)
    Notify.create({
      type: 'negative',
      message: 'Failed to export CSV',
    })
  }
}

// CVSU Grading System Helper Functions (with decimal support)
// CVSU Grading Scale: 1.0-1.5=Perfect, 1.6-2.5=Good, 2.6-3.0=Pass, 3.1-5.0=Failed
const getGradeColor = (grade) => {
  const numGrade = parseFloat(grade)
  if (isNaN(numGrade)) return 'grey'
  
  if (numGrade >= 1.0 && numGrade <= 1.5) return 'green'      
  if (numGrade >= 1.6 && numGrade <= 2.5) return 'blue'     
  if (numGrade >= 2.6 && numGrade <= 3.0) return 'orange'     
  if (numGrade >= 3.1 && numGrade <= 5.0) return 'red'        
  
  return 'grey'
}

const getGradeDescription = (grade) => {
  const numGrade = parseFloat(grade)
  if (isNaN(numGrade)) return 'Invalid'
  
  if (numGrade >= 1.0 && numGrade <= 1.5) return 'Perfect'
  if (numGrade >= 1.6 && numGrade <= 2.5) return 'Good'
  if (numGrade >= 2.6 && numGrade <= 3.0) return 'Pass'
  if (numGrade >= 3.1 && numGrade <= 5.0) return 'Failed'
  
  return 'Invalid'
}

// Grade columns definition
const gradeColumns = [
  {
    name: 'code',
    label: 'Course Code',
    field: (row) => row.courseId?.code || '',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Course Name',
    field: (row) => row.courseId?.name || '',
    sortable: true,
  },
  {
    name: 'sem',
    label: 'Semester',
    field: (row) => {
      // Prioritize courseId.semester as it contains the correct semester information
      if (row.courseId?.semester) return row.courseId.semester
      // Fallback to sem field if courseId.semester is not available
      if (row.sem) return row.sem
      return '-'
    },
    sortable: true,
    align: 'center'
  },
  {
    name: 'year',
    label: 'Year',
    field: (row) => {
      // Prioritize year field from course entry, fallback to courseId.year
      if (row.year) return row.year
      if (row.courseId?.year) return row.courseId.year
      return '-'
    },
    sortable: true,
    align: 'center'
  },
  { 
    name: 'grade', 
    label: 'Grade', 
    field: 'grade', 
    sortable: true,
    align: 'center'
  },
  {
    name: 'description',
    label: 'Status',
    field: (row) => getGradeDescription(row.grade),
    sortable: true,
    align: 'center'
  },
]

// Helper function to normalize semester value
const normalizeSemester = (sem) => {
  if (!sem) return ''
  const semStr = String(sem).trim()
  const semLower = semStr.toLowerCase()
  
  // Check for various formats - be more flexible
  if (semLower.includes('first') || semLower === '1' || semLower === 'first semester' || semLower === '1st') {
    return 'first'
  }
  if (semLower.includes('second') || semLower === '2' || semLower === 'second semester' || semLower === '2nd') {
    return 'second'
  }
  if (semLower.includes('summer') || semLower === '3' || semLower === 'summer semester' || semLower === '3rd') {
    return 'summer'
  }
  
  // Return original if no match (for display purposes)
  return semStr
}

// Helper function to get semester from course (prioritizes courseId.semester as it's more accurate)
const getCourseSemester = (course) => {
  // Prioritize courseId.semester as it contains the correct semester information
  // The course.sem field may be incorrect (e.g., all showing '1st')
  if (course.courseId?.semester) {
    return normalizeSemester(course.courseId.semester)
  }
  // Fallback to sem field if courseId.semester is not available
  if (course.sem) {
    return normalizeSemester(course.sem)
  }
  return ''
}

// Helper function to normalize year value
const normalizeYear = (year) => {
  if (!year) return ''
  const yearStr = String(year).trim()
  const yearLower = yearStr.toLowerCase()
  
  // Check for various formats
  if (yearLower.includes('first') || yearLower === '1' || yearLower === '1st' || yearLower === 'first year') {
    return 'First'
  }
  if (yearLower.includes('second') || yearLower === '2' || yearLower === '2nd' || yearLower === 'second year') {
    return 'Second'
  }
  if (yearLower.includes('third') || yearLower === '3' || yearLower === '3rd' || yearLower === 'third year') {
    return 'Third'
  }
  if (yearLower.includes('fourth') || yearLower === '4' || yearLower === '4th' || yearLower === 'fourth year') {
    return 'Fourth'
  }
  
  // Return capitalized first letter if it's a single word (e.g., "first" -> "First")
  if (yearStr.length > 0) {
    return yearStr.charAt(0).toUpperCase() + yearStr.slice(1).toLowerCase()
  }
  
  return yearStr
}

// Helper function to get year level from course (prioritizes courseId.year as it's more accurate)
const getCourseYear = (course) => {
  // Prioritize courseId.year as it contains the correct year level information
  if (course.courseId?.year) {
    return normalizeYear(course.courseId.year)
  }
  // Fallback to year field if courseId.year is not available
  if (course.year) {
    return normalizeYear(course.year)
  }
  return ''
}

// Helper function to filter courses by year level
const filterByYear = (courses) => {
  if (selectedYearFilter.value === 'all') return courses
  return courses.filter(course => {
    const year = getCourseYear(course)
    return year === selectedYearFilter.value
  })
}

// Computed properties for filtering courses by semester and year
const firstSemesterCourses = computed(() => {
  if (!selectedStudent.value?.courses || !Array.isArray(selectedStudent.value.courses)) return []
  const filtered = selectedStudent.value.courses.filter(course => {
    if (!course) return false
    const sem = getCourseSemester(course)
    return sem === 'first'
  })
  return filterByYear(filtered)
})

const secondSemesterCourses = computed(() => {
  if (!selectedStudent.value?.courses || !Array.isArray(selectedStudent.value.courses)) return []
  const filtered = selectedStudent.value.courses.filter(course => {
    if (!course) return false
    const sem = getCourseSemester(course)
    return sem === 'second'
  })
  return filterByYear(filtered)
})

const summerSemesterCourses = computed(() => {
  if (!selectedStudent.value?.courses || !Array.isArray(selectedStudent.value.courses)) return []
  const filtered = selectedStudent.value.courses.filter(course => {
    if (!course) return false
    const sem = getCourseSemester(course)
    return sem === 'summer'
  })
  return filterByYear(filtered)
})

// Computed property for all courses filtered by year
const allCoursesFiltered = computed(() => {
  if (!selectedStudent.value?.courses || !Array.isArray(selectedStudent.value.courses)) return []
  return filterByYear(selectedStudent.value.courses)
})

onMounted(() => {
  userInfo()
  getAllStudents()
  fetchPrograms()
  getSemester()
})
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%

.button-container
  width: auto
  display: flex
  flex-wrap: wrap
  gap: 10px

.button-section
  width: 180px
  height: 80px
  padding: 8px
  @media (max-width: 600px)
    width: 100%
    height: 60px
    padding: 4px

.action-button
  background-color: #2d5429
  color: #ffffff
  border-radius: 10px
  width: 100%
  height: 100%

.responsive-table
  :deep(.q-table__container)
    overflow-x: auto

  :deep(.q-table)
    min-width: 600px

  @media (max-width: 600px)
    :deep(.q-table__top)
      flex-direction: column
      align-items: stretch
      padding: 8px

    :deep(.q-table__top-left)
      margin-bottom: 8px

    :deep(.q-table__top-right)
      margin-top: 8px

    :deep(.q-table__middle)
      max-width: 100vw
      overflow-x: auto

    :deep(.q-td)
      white-space: nowrap
      padding: 8px

@media (max-width: 600px)
  .content-container
    padding: 8px !important

  .q-table__grid-content
    flex: 1 1 100%

  .text-h6
    font-size: 1.1rem

.input-field
  background-color: #fdfede
  border-radius: 8px
  padding: 4px 12px

@media (max-width: 600px)
  .input-field
    width: 100%

  .q-dialog__inner > div
    max-height: 90vh
</style>
