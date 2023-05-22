<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { login } from '@/api'
import { getLocal, removeLocal, setLocal, setToken } from '@/utils'
import bgImg from '@/assets/images/login_bg.webp'
import { addDynamicRoutes } from '@/router'
import ThemeMode from '@/layout/header/components/ThemeMode.vue'

const title: string = import.meta.env.VITE_APP_TITLE

const router = useRouter()
const route = useRoute()
const query = route.query

interface LoginInfo {
  phone: string
  password: string
}

const loginInfo = ref<LoginInfo>({
  phone: '',
  password: '',
})

const localLoginInfo = getLocal('loginInfo') as LoginInfo
if (localLoginInfo) {
  loginInfo.value.phone = localLoginInfo.phone || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

const loging = ref<boolean>(false)
const isRemember = useStorage('isRemember', false)
async function handleLogin() {
  const { phone, password } = loginInfo.value
  if (!phone || !password) {
    window.$message?.warning('请输入用户名和密码')
    return
  }
  try {
    loging.value = true
    const res: any = await login({ phone, password: password.toString() })
    window.$notification?.success({ title: '登录成功！', duration: 2500 })
    setToken(res.data.token)
    if (isRemember.value)
      setLocal('loginInfo', { phone, password })
    else
      removeLocal('loginInfo')

    await addDynamicRoutes()
    if (query.redirect) {
      const path = query.redirect as string
      Reflect.deleteProperty(query, 'redirect')
      router.push({ path, query })
    }
    else {
      router.push('/')
    }
  }
  catch (error) {
    console.error(error)
  }
  loging.value = false
}
</script>

<template>
  <AppPage class="dark:brightness-70" :show-footer="true" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <ThemeMode class="absolute left-20 top-20" />

    <div m-auto min-w-345 f-c-c rounded-10 bg-white bg-opacity-60 p-15 card-shadow dark:bg-dark>
      <div hidden w-380 px-20 py-35 md:block>
        <img src="@/assets/images/login_banner.webp" w-full alt="login_banner">
      </div>

      <div w-320 flex-col px-20 py-35>
        <h5 f-c-c text-24 font-normal color="#6a6a6a">
          <icon-custom-logo class="mr-30 text-50 color-primary" />{{ title }}
        </h5>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.phone"
            autofocus
            class="h-50 items-center pl-10 text-16"
            placeholder="admin"
            :maxlength="20"
          />
        </div>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.password"
            class="h-50 items-center pl-10 text-16"
            type="password"
            show-password-on="mousedown"
            placeholder="123456"
            :maxlength="20"
            @keydown.enter="handleLogin"
          />
        </div>

        <div mt-20>
          <n-checkbox :checked="isRemember" label="记住我" :on-update:checked="(val:boolean) => (isRemember = val)" />
        </div>

        <div mt-20>
          <n-button h-50 w-full rounded-5 text-16 type="primary" :loading="loging" @click="handleLogin">
            登录
          </n-button>
        </div>
      </div>
    </div>
  </AppPage>
</template>
