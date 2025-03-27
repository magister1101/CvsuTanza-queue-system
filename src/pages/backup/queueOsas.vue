<template>
  <q-page style="height: 90vh">
    <div class="main-container q-pt-md">
      <div class="content-container q-px-md q-px-sm-xl">
        <q-card-section class="row justify-around q-col-gutter-md" style="color: #3d3c3b">
          <div
            class="info-box q-py-md ellipsis"
            style="
              background-color: #fafedd;
              border: 2px solid #cbcdc7;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="text-h5 text-weight-medium">DEPARTMENT</div>
            <div class="text-h3 text-weight-medium">OSAS</div>
          </div>
          <div
            class="info-box q-py-md ellipsis"
            style="
              background-color: #cbf980;
              border: 2px solid #cbcdc7;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="text-h5 text-weight-medium">WINDOW</div>
            <div class="text-h3 text-weight-medium">3</div>
          </div>
          <div
            class="info-box q-py-md ellipsis"
            style="
              background-color: #fafedd;
              border: 2px solid #cbcdc7;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="text-h5 text-weight-medium">CURRENT</div>
            <div class="text-h3 text-weight-medium">S0001</div>
          </div>
        </q-card-section>
        <!-- buttons -->
        <q-card-section class="row justify-around q-col-gutter-md">
          <div class="action-button-container ellipsis">
            <q-btn class="action-button" style="background-color: #a7ab01">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="arrow_right_alt" size="80px" />
                <div class="text-h4 text-weight-medium">NEXT</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn class="action-button" style="background-color: #02ceed">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="volume_up" size="80px" />
                <div class="text-h4 text-weight-medium">CALL</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn class="action-button" style="background-color: #a8aba9">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="lock" size="80px" />
                <div class="text-h4 text-weight-medium">STANDBY</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn class="action-button" style="background-color: #a8aba9">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="sync_alt" size="80px" />
                <div class="text-h4 text-weight-medium">TRANSFER</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn class="action-button" style="background-color: #08fe08">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="check" size="80px" />
                <div class="text-h4 text-weight-medium">DONE</div>
              </div>
            </q-btn>
          </div>
          <div class="action-button-container ellipsis">
            <q-btn class="action-button" style="background-color: #f60707">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                <q-icon name="close" size="80px" />
                <div class="text-h4 text-weight-medium">CANCEL</div>
              </div>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section
          class="row justify-around q-py-md q-mt-md"
          style="background-color: #fafedd; border: 2px solid #cbcdc7; height: auto"
        >
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              WAITING NUMBER
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                text-align: center;
                overflow-y: scroll;
              "
              class="text-h5 q-py-md"
            >
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
            </div>
          </div>
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              SUCCESFULL <br />TRANSACTIONS
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                text-align: center;
                overflow-y: scroll;
              "
              class="text-h5 q-py-md"
            >
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
            </div>
          </div>
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              LAST CALLED
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                text-align: center;
                overflow-y: scroll;
              "
              class="text-h5 q-py-md"
            >
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
            </div>
          </div>
          <div class="list-container" style="border: 2px solid #cbcdc7">
            <div
              class="text-h6"
              style="
                background-color: #132b12;
                color: #ffffff;
                width: 100%;
                text-align: center;
                justify-content: center;
                height: 70px;
                display: flex;
                align-items: center;
              "
            >
              MISSED NUMBER
            </div>
            <div
              style="
                background-color: #fefffe;
                height: 350px;
                width: 100%;
                text-align: center;
                overflow-y: scroll;
              "
              class="text-h5 q-py-md"
            >
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
              <div>1234</div>
            </div>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
//
</script>

<style lang="sass" scoped>
.main-container
  background-color: #dadada
  min-height: 100%

.info-box
  width: 400px
  height: 150px

.action-button
  height: 150px
  width: 200px

.list-container
  width: 300px

@media (max-width: 1440px)
  .info-box
    width: 300px
    height: 130px
  .action-button
    width: 180px
    height: 130px
  .list-container
    width: 250px

@media (max-width: 1024px)
  .info-box
    width: 250px
    height: 120px
  .action-button
    width: 150px
    height: 120px
  .list-container
    width: 200px

@media (max-width: 768px)
  .info-box
    width: 200px
    height: 100px
  .action-button
    width: 130px
    height: 100px
    .q-icon
      font-size: 50px !important
    .text-h4
      font-size: 1.2rem
  .list-container
    width: 180px

@media (max-width: 599px)
  .info-box
    width: 100%
    height: 100px
    margin-bottom: 8px
  .action-button
    width: 100%
    height: 100px
    margin-bottom: 8px
  .list-container
    width: 100%
    margin-bottom: 16px
  .q-card-section
    padding: 8px !important
</style>
