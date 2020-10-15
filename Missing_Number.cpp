#include<bits/stdc++.h>
using namespace std;
int main()
{
	long long n,sumg=0,sumf=0;
	cin>>n;
	
	for(int i=1;i<n;i++)
	{
		int a;
		cin>>a;
		sumf+=a;
	}
	
	
	for(int i=1;i<=n;i++)
	{
		sumg+=i;
	}
	cout<<sumg-sumf;
			
	
	
}
